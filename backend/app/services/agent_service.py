from ..models.schemas import CreateAgentRequest
from ..utils.db import supabase_client
from .ingestion import run_ingestion_pipeline
from .rag_service import store_embeddings_in_qdrant
import uuid
import logging
import os

logger = logging.getLogger(__name__)

def generate_system_prompt(details) -> str:
    return f"""You are {details.name}.
Role:
{details.role}

Description:
{details.description}

Responsibilities:
* Answer questions accurately.
* Use provided knowledge base.
* Cite knowledge when possible.
* Never invent information.
* Escalate when confidence is low.

Behavior Rules:
* Professional
* Helpful
* Accurate
* Context aware"""

def deploy_agent_pipeline(agent_id: str, request: CreateAgentRequest) -> dict:
    """
    Executes the 10-step Agent Deployment Pipeline:
    Step 1: DB creation (already done in create_agent_record with status 'creating_agent')
    Step 2: Qdrant collection setup (handled in store_embeddings_in_qdrant)
    Step 3-7: Parse files, crawl web, chunk content, generate HuggingFace embeddings, upsert to Qdrant.
    Step 8: Save memory configurations in agent_memory.
    Step 9: Save channel configurations in agent_channels.
    Step 10: Set status to ACTIVE.
    """
    try:
        # Step 2 & 3: Ingestion & Uploads processing
        if supabase_client:
            supabase_client.table('agents').update({"status": "uploading_documents"}).eq('id', agent_id).execute()

        # Step 4 & 5: Processing Knowledge Base
        if supabase_client:
            supabase_client.table('agents').update({"status": "processing_kb"}).eq('id', agent_id).execute()
        
        # Run Ingestion & Chunking
        chunks = run_ingestion_pipeline(
            files=request.knowledge_base.files,
            urls=request.knowledge_base.website_urls,
            faqs=[faq.model_dump() for faq in request.knowledge_base.faqs]
        )
        
        # Step 6 & 7: Generating & storing embeddings in Qdrant
        if supabase_client:
            supabase_client.table('agents').update({"status": "generating_embeddings"}).eq('id', agent_id).execute()
            
        if chunks:
            store_embeddings_in_qdrant(agent_id, chunks)
            
            # Save Document records in agent_documents table for visibility
            if supabase_client:
                # Group chunks by source/filename to count
                for file_path in request.knowledge_base.files:
                    file_name = os.path.basename(file_path)
                    file_ext = os.path.splitext(file_path)[1].replace(".", "").lower()
                    file_chunks = [c for c in chunks if c.metadata.get("source") == file_name]
                    
                    supabase_client.table('agent_documents').insert({
                        "agent_id": agent_id,
                        "file_name": file_name,
                        "file_path": file_path,
                        "file_type": file_ext,
                        "chunk_count": len(file_chunks)
                    }).execute()
                    
                for url in request.knowledge_base.website_urls:
                    url_chunks = [c for c in chunks if c.metadata.get("source") == url]
                    supabase_client.table('agent_documents').insert({
                        "agent_id": agent_id,
                        "file_name": url,
                        "file_path": url,
                        "file_type": "web",
                        "chunk_count": len(url_chunks)
                    }).execute()
                    
                if request.knowledge_base.faqs:
                    faq_chunks = [c for c in chunks if c.metadata.get("source") == "faq"]
                    supabase_client.table('agent_documents').insert({
                        "agent_id": agent_id,
                        "file_name": "Manual FAQs",
                        "file_path": "manual_faqs",
                        "file_type": "faq",
                        "chunk_count": len(faq_chunks)
                    }).execute()

        # Step 8 & 9: Deploying agent - saving config
        if supabase_client:
            supabase_client.table('agents').update({"status": "deploying_agent"}).eq('id', agent_id).execute()
            
            # Save memory config
            supabase_client.table('agent_memory').insert({
                "agent_id": agent_id,
                "session_memory_enabled": request.memory_config.session_memory_enabled,
                "long_term_memory_enabled": request.memory_config.long_term_memory_enabled,
                "retention_period_days": str(request.memory_config.retention_period_days)
            }).execute()
            
            # Save channel configuration (Create agent_channels records)
            for channel, is_enabled in request.channels.model_dump().items():
                if is_enabled:
                    supabase_client.table('agent_channels').insert({
                        "agent_id": agent_id,
                        "channel_type": channel,
                        "status": "configured"
                    }).execute()
                    
        # Step 10: Set status to ACTIVE and save system prompt
        system_prompt = generate_system_prompt(request.agent_details)
        if supabase_client:
            supabase_client.table('agents').update({
                "status": "active",
                "system_prompt": system_prompt
            }).eq('id', agent_id).execute()
            
        logger.info(f"Successfully deployed agent {agent_id}")
        return {"success": True, "agent_id": agent_id, "status": "ACTIVE"}
        
    except Exception as e:
        logger.error(f"Error deploying agent {agent_id}: {e}")
        if supabase_client:
            supabase_client.table('agents').update({
                "status": "failed",
                "error_log": str(e)
            }).eq('id', agent_id).execute()
        return {"success": False, "agent_id": agent_id, "status": "FAILED", "error": str(e)}

def create_agent_record(request: CreateAgentRequest, user_id: str) -> str:
    """
    Step 1: Create agent record in Supabase with 'creating_agent' status.
    Returns agent_id
    """
    agent_id = str(uuid.uuid4())
    
    if supabase_client:
        try:
            data = {
                "id": agent_id,
                "name": request.agent_details.name,
                "description": request.agent_details.description,
                "role": request.agent_details.role,
                "status": "creating_agent",
                "user_id": user_id
            }
            supabase_client.table('agents').insert(data).execute()
        except Exception as e:
            logger.error(f"Failed to create agent in Supabase: {e}")
            
    return agent_id

