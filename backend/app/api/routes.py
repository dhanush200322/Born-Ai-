from fastapi import APIRouter, BackgroundTasks, HTTPException, File, UploadFile, Depends
from typing import List, Optional
import os
import shutil
import uuid
from ..models.schemas import (
    CreateAgentRequest, 
    ChatRequest, 
    ChatResponse, 
    UploadResponse, 
    DeployResponse
)
from ..services.agent_service import create_agent_record, deploy_agent_pipeline
from ..services.rag_service import generate_chat_response_stream
from ..utils.db import supabase_client
from ..utils.auth import get_current_user, get_optional_user

router = APIRouter()

@router.post("/deploy", response_model=DeployResponse)
async def deploy_agent(request: CreateAgentRequest, current_user = Depends(get_current_user)):
    """
    10-Step Agent Deployment API
    Creates agent record in Supabase, and performs vector + storage setup.
    """
    try:
        # Step 1: Create Supabase Record (status = creating_agent)
        agent_id = create_agent_record(request, current_user.id)
        
        # Run the deployment pipeline synchronously
        result = deploy_agent_pipeline(agent_id, request)
        
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=result.get("error", "Deployment failed"))
            
        return DeployResponse(
            success=True,
            agent_id=agent_id,
            status="ACTIVE"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def upload_files(files: List[UploadFile] = File(...), current_user = Depends(get_current_user)):
    """
    Upload files to local directory and return paths.
    """
    try:
        uploaded_paths = []
        uploaded_names = []
        
        os.makedirs("uploads", exist_ok=True)
        
        for file in files:
            file_id = str(uuid.uuid4())[:8]
            clean_filename = f"{file_id}_{file.filename}"
            dest_path = os.path.join("uploads", clean_filename)
            
            with open(dest_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
                
            uploaded_paths.append(os.path.abspath(dest_path))
            uploaded_names.append(file.filename)
            
        return {
            "success": True, 
            "file_paths": uploaded_paths,
            "file_names": uploaded_names
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{agent_id}")
async def get_agent_details(agent_id: str, current_user = Depends(get_optional_user)):
    """
    Fetch comprehensive details for the Agent Playground.
    """
    if not supabase_client:
        raise HTTPException(status_code=500, detail="Database connection unavailable.")
        
    try:
        # Fetch agent basic info
        agent_res = supabase_client.table('agents').select('*').eq('id', agent_id).execute()
        if not agent_res.data or len(agent_res.data) == 0:
            raise HTTPException(status_code=404, detail="Agent not found")
        agent_data = agent_res.data[0]

        # Scope validation
        if current_user:
            if agent_data.get('user_id') != current_user.id:
                raise HTTPException(status_code=404, detail="Agent not found")
        else:
            if agent_data.get('status') != 'active':
                raise HTTPException(status_code=403, detail="Unauthenticated access is forbidden for inactive agents")
        
        # Fetch memory settings
        mem_res = supabase_client.table('agent_memory').select('*').eq('agent_id', agent_id).execute()
        memory_data = mem_res.data[0] if mem_res.data and len(mem_res.data) > 0 else {}
        
        # Fetch channels
        chan_res = supabase_client.table('agent_channels').select('*').eq('agent_id', agent_id).execute()
        channels_data = chan_res.data if chan_res.data else []
        
        # Fetch uploaded documents list
        doc_res = supabase_client.table('agent_documents').select('*').eq('agent_id', agent_id).execute()
        documents_data = doc_res.data if doc_res.data else []
        
        return {
            "success": True,
            "agent": agent_data,
            "memory": memory_data,
            "channels": channels_data,
            "documents": documents_data
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi.responses import StreamingResponse

@router.post("/{agent_id}/chat")
async def chat_with_agent(agent_id: str, request: ChatRequest, current_user = Depends(get_optional_user)):
    """
    Agent Chat Endpoint
    Handles vector retrieval, invokes ChatGroq with streaming.
    """
    if not supabase_client:
        raise HTTPException(status_code=500, detail="Database connection unavailable.")
        
    try:
        # Fetch agent info to verify ownership / status
        agent_res = supabase_client.table('agents').select('*').eq('id', agent_id).execute()
        if not agent_res.data or len(agent_res.data) == 0:
            raise HTTPException(status_code=404, detail="Agent not found")
        agent_data = agent_res.data[0]
        
        # Check ownership / public access
        if current_user:
            if agent_data.get('user_id') != current_user.id:
                raise HTTPException(status_code=404, detail="Agent not found")
        else:
            if agent_data.get('status') != 'active':
                raise HTTPException(status_code=403, detail="Unauthenticated access is forbidden for inactive agents")

        system_prompt = agent_data.get('system_prompt') or "You are a helpful assistant."
        
        # 2. Get or create session ID
        session_id = request.session_id
        if not session_id:
            session_res = supabase_client.table('chat_sessions').insert({
                "agent_id": agent_id,
                "session_name": f"Chat session {str(uuid.uuid4())[:8]}"
            }).execute()
            if session_res.data and len(session_res.data) > 0:
                session_id = session_res.data[0]['id']
            else:
                raise HTTPException(status_code=500, detail="Failed to create chat session record")
        
        # 3. Save User message to Database
        supabase_client.table('chat_messages').insert({
            "session_id": session_id,
            "sender": "user",
            "message": request.message,
            "sources": []
        }).execute()
        
        from ..services.rag_service import generate_chat_response_stream
        
        # 4. Return StreamingResponse
        return StreamingResponse(
            generate_chat_response_stream(agent_id, request.message, system_prompt, session_id),
            media_type="text/event-stream"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{agent_id}/sessions")
async def list_agent_sessions(agent_id: str, current_user = Depends(get_optional_user)):
    """
    Retrieve all chat sessions for this agent.
    """
    if not supabase_client:
        raise HTTPException(status_code=500, detail="Database client offline.")
    try:
        agent_res = supabase_client.table('agents').select('user_id', 'status').eq('id', agent_id).execute()
        if not agent_res.data or len(agent_res.data) == 0:
            raise HTTPException(status_code=404, detail="Agent not found")
        agent_data = agent_res.data[0]
        
        if current_user:
            if agent_data.get('user_id') != current_user.id:
                raise HTTPException(status_code=404, detail="Agent not found")
        else:
            if agent_data.get('status') != 'active':
                raise HTTPException(status_code=403, detail="Access is forbidden")
                
        res = supabase_client.table('chat_sessions').select('*').eq('agent_id', agent_id).order('created_at', desc=True).execute()
        return res.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{agent_id}/sessions/{session_id}/messages")
async def list_session_messages(agent_id: str, session_id: str, current_user = Depends(get_optional_user)):
    """
    Retrieve message history for a specific chat session.
    """
    if not supabase_client:
        raise HTTPException(status_code=500, detail="Database client offline.")
    try:
        # Verify agent matches and user has access to this agent
        agent_res = supabase_client.table('agents').select('user_id', 'status').eq('id', agent_id).execute()
        if not agent_res.data or len(agent_res.data) == 0:
            raise HTTPException(status_code=404, detail="Agent not found")
        agent_data = agent_res.data[0]
        
        if current_user:
            if agent_data.get('user_id') != current_user.id:
                raise HTTPException(status_code=404, detail="Agent not found")
        else:
            if agent_data.get('status') != 'active':
                raise HTTPException(status_code=403, detail="Access is forbidden")
                
        # Verify session matches the agent
        session_res = supabase_client.table('chat_sessions').select('agent_id').eq('id', session_id).execute()
        if not session_res.data or len(session_res.data) == 0 or session_res.data[0]['agent_id'] != agent_id:
            raise HTTPException(status_code=404, detail="Session not found for this agent")
            
        res = supabase_client.table('chat_messages').select('*').eq('session_id', session_id).order('created_at', desc=False).execute()
        return res.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{agent_id}/sessions")
async def create_chat_session(agent_id: str, session_name: Optional[str] = "New Chat", current_user = Depends(get_optional_user)):
    """
    Explicitly create a new chat session for playground.
    """
    if not supabase_client:
        raise HTTPException(status_code=500, detail="Database client offline.")
    try:
        agent_res = supabase_client.table('agents').select('user_id', 'status').eq('id', agent_id).execute()
        if not agent_res.data or len(agent_res.data) == 0:
            raise HTTPException(status_code=404, detail="Agent not found")
        agent_data = agent_res.data[0]
        
        if current_user:
            if agent_data.get('user_id') != current_user.id:
                raise HTTPException(status_code=404, detail="Agent not found")
        else:
            if agent_data.get('status') != 'active':
                raise HTTPException(status_code=403, detail="Access is forbidden")
                
        res = supabase_client.table('chat_sessions').insert({
            "agent_id": agent_id,
            "session_name": session_name
        }).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        raise HTTPException(status_code=500, detail="Failed to create session.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def list_all_agents(current_user = Depends(get_current_user)):
    """
    Fetch all agents for the dashboard.
    """
    if not supabase_client:
        raise HTTPException(status_code=500, detail="Database connection unavailable.")
    try:
        res = supabase_client.table('agents').select('*').eq('user_id', current_user.id).order('created_at', desc=True).execute()
        return {"success": True, "agents": res.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-instructions")
async def analyze_instructions(request: dict, current_user = Depends(get_current_user)):
    """
    Analyze and optimize agent instructions using Groq.
    """
    description = request.get("description", "")
    if not description:
        raise HTTPException(status_code=400, detail="Description is required")
        
    try:
        from langchain_groq import ChatGroq
        from langchain_core.prompts import ChatPromptTemplate
        from ..core.config import settings
        
        llm = ChatGroq(
            groq_api_key=settings.GROQ_API_KEY,
            model_name="llama-3.1-8b-instant"
        )
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert AI agent instruction optimizer. Your task is to take a raw description of an AI agent and rewrite it into a highly professional, structured, and clear set of instructions and behavioral guidelines. Use bullet points and clear formatting. Output ONLY the improved instructions, nothing else. Do not wrap in markdown code blocks, just output the text."),
            ("user", "Here is the raw description: {description}")
        ])
        chain = prompt | llm
        
        response = await chain.ainvoke({"description": description})
        return {"success": True, "optimized_description": response.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
