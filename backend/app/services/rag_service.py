from ..utils.db import qdrant_client, supabase_client
from qdrant_client.models import Distance, VectorParams, PointStruct
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.documents import Document
from ..core.config import settings
import uuid
import time
from typing import List, Optional, AsyncGenerator
import logging
import json

logger = logging.getLogger(__name__)

# Initialize HuggingFace Embeddings
embeddings = None
try:
    from langchain_huggingface import HuggingFaceEmbeddings
    logger.info("Imported HuggingFaceEmbeddings from langchain_huggingface")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
except Exception as e1:
    logger.warning(f"Could not import/init langchain_huggingface, trying community: {e1}")
    try:
        from langchain_community.embeddings import HuggingFaceEmbeddings
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    except Exception as e2:
        logger.error(f"Failed to initialize HuggingFace embeddings: {e2}")

def store_embeddings_in_qdrant(agent_id: str, chunks: List[Document]):
    if not qdrant_client or not embeddings:
        logger.error("Qdrant client or embeddings not initialized.")
        return
        
    collection_name = f"agent_{agent_id}"
    
    # Check if collection exists
    try:
        collections = qdrant_client.get_collections().collections
        exists = any(c.name == collection_name for c in collections)
        
        if not exists:
            # Dynamically get dimension
            test_emb = embeddings.embed_query("test")
            dim = len(test_emb)
            logger.info(f"Creating Qdrant collection {collection_name} with dimension {dim}")
            
            qdrant_client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=dim, distance=Distance.COSINE),
            )
    except Exception as e:
        logger.error(f"Error ensuring collection exists: {e}")
        return

    # Embed documents
    texts = [c.page_content for c in chunks]
    metadatas = [c.metadata for c in chunks]
    
    # Generate vectors
    try:
        vectors = embeddings.embed_documents(texts)
        
        points = []
        for i, (vector, text, meta) in enumerate(zip(vectors, texts, metadatas)):
            chunk_id = str(uuid.uuid4())
            points.append(
                PointStruct(
                    id=chunk_id,
                    vector=vector,
                    payload={
                        "agent_id": agent_id,
                        "source": meta.get("source", "unknown"),
                        "title": meta.get("title", meta.get("source", "Document")),
                        "source_type": meta.get("source_type", "docs"),
                        "original_filename": meta.get("original_filename", "Unknown"),
                        "chunk_id": chunk_id,
                        "chunk_text": text
                    }
                )
            )
            
        # Store in Qdrant
        qdrant_client.upsert(
            collection_name=collection_name,
            points=points
        )
        logger.info(f"Successfully stored {len(points)} chunks for agent {agent_id}")
    except Exception as e:
        logger.error(f"Failed to store embeddings: {e}")

async def generate_chat_response_stream(agent_id: str, query: str, base_system_prompt: str, session_id: str) -> AsyncGenerator[str, None]:
    start_time = time.time()
    
    # 1. Smart Prompt Engineering
    smart_instructions = (
        "You are an advanced enterprise AI assistant.\n\n"
        "# Educational Response Quality Prompt\n"
        "When explaining any concept, adapt the explanation to the user's requested knowledge level (beginner, child, student, professional, or expert).\n\n"
        "Always follow this structure:\n\n"
        "## 1. Simple Introduction\n"
        "Start with a short, easy-to-understand explanation (2-3 sentences) that immediately answers the question.\n\n"
        "## 2. Core Explanation\n"
        "Explain the concept using accurate information. Never sacrifice correctness for simplicity. Avoid common misconceptions or oversimplified statements that could become scientifically incorrect.\n\n"
        "## 3. Real-World Analogy\n"
        "Use one simple analogy that most people understand (LEGO, books, toys, cars, cooking, sports, etc.). Make sure the analogy helps understanding without introducing incorrect ideas.\n\n"
        "## 4. Key Terms\n"
        "Introduce important terminology naturally. Briefly define each important term in one sentence without overwhelming the reader. Example:\n"
        "• Qubit\n• Superposition\n• Measurement\n\n"
        "## 5. Real-World Applications\n"
        "Explain where the concept is used in everyday life or industry.\n\n"
        "## 6. Key Takeaway\n"
        "End with a short summary (2-4 bullet points) highlighting the most important ideas.\n\n"
        "## 7. Continue Learning\n"
        "Finish with a friendly follow-up question encouraging deeper exploration.\n\n"
        "Formatting Guidelines:\n"
        "* Use Markdown headings.\n"
        "* Use bullet points where appropriate.\n"
        "* Bold important terms.\n"
        "* Keep paragraphs short (2-4 lines).\n"
        "* Add relevant emojis only when they improve readability.\n"
        "* Maintain generous spacing between sections.\n"
        "* Make the response visually easy to scan.\n\n"
        "Accuracy Rules:\n"
        "* Never present incorrect simplifications as facts.\n"
        "* If using analogies, clearly distinguish the analogy from reality.\n"
        "* State uncertainty when appropriate instead of guessing.\n"
        "* Prioritize factual correctness over entertainment.\n\n"
        "Writing Style:\n"
        "* Friendly and conversational.\n"
        "* Professional but approachable.\n"
        "* Educational without sounding like a textbook.\n"
        "* Natural human tone.\n"
        "* Avoid repetitive wording.\n"
        "* Avoid unnecessary filler.\n\n"
        "# Premium Long-Form Response Rules\n"
        "For any response longer than approximately 500 words:\n\n"
        "## Structure\n"
        "* Start with a short executive summary.\n"
        "* Organize the content using clear Markdown headings (#, ##, ###).\n"
        "* Keep paragraphs to 2-4 lines.\n"
        "* Leave blank lines between sections for readability.\n\n"
        "## Visual Presentation\n"
        "When appropriate, include:\n"
        "* Comparison tables\n"
        "* Timelines\n"
        "* Bullet lists\n"
        "* Numbered steps\n"
        "* ASCII diagrams or flowcharts\n"
        "* Highlight boxes (💡 Tip, ⚠️ Note, 🚀 Future, 🎯 Key Takeaway)\n\n"
        "## Technical Depth\n"
        "Progress from beginner concepts to advanced topics naturally.\n"
        "Include modern technologies and current industry practices where relevant.\n\n"
        "## Examples\n"
        "Use real-world examples from well-known companies or products whenever they improve understanding.\n\n"
        "## Conclusion\n"
        "Always finish with:\n"
        "* Key Takeaways (3-6 concise bullets)\n"
        "* Suggested next learning topics or follow-up questions\n\n"
        "## Quality Standards\n"
        "Avoid walls of text. Avoid repeating the same information. Prefer visual organization over long paragraphs. Optimize every response for readability, professionalism, and educational value.\n\n"
        "# Enterprise Coding Response Rules\n"
        "For all software engineering requests:\n\n"
        "## Architecture First\n"
        "Always begin with:\n"
        "* System architecture overview\n"
        "* Technology stack\n"
        "* Folder structure\n"
        "* Design patterns\n"
        "* Scalability considerations\n\n"
        "## Modern Best Practices\n"
        "Prefer the latest stable versions and modern APIs. Avoid deprecated patterns.\n"
        "Examples: SQLAlchemy 2.x, Pydantic v2, AsyncSession, Annotated dependencies, FastAPI lifespan events.\n\n"
        "## Production Readiness\n"
        "When asked for production code, include:\n"
        "* Authentication and authorization\n"
        "* Validation\n"
        "* Error handling\n"
        "* Structured logging\n"
        "* Monitoring\n"
        "* Configuration management\n"
        "* Environment variables\n"
        "* Secrets handling\n"
        "* Security best practices\n"
        "* Docker\n"
        "* CI/CD\n"
        "* Testing strategy\n"
        "* Caching\n"
        "* Performance optimization\n\n"
        "## Code Quality\n"
        "Generate complete, working examples rather than placeholders.\n"
        "Avoid undefined variables and pseudo-code unless clearly labeled.\n\n"
        "## Visual Documentation\n"
        "When appropriate, include: Folder structures, Sequence diagrams, Request lifecycle diagrams, Authentication flow diagrams, Deployment architecture, Database relationship diagrams, API endpoint tables.\n\n"
        "## Security\n"
        "Default to secure implementations: JWT with refresh tokens, Password hashing (bcrypt or Argon2), RBAC, Input validation, Rate limiting, Secure headers, SQL injection protection, XSS mitigation, Environment-based configuration.\n\n"
        "## Style\n"
        "Write like a senior software architect preparing documentation for an enterprise engineering team.\n\n"
        "IMPORTANT RULES:\n"
        "- If the provided knowledge base does not contain the answer, answer using your own general knowledge. DO NOT say 'I don't know based on the knowledge base'.\n\n"
        "ENTERPRISE UI REQUIREMENT: You MUST use the following JSON markdown blocks to render interactive components when applicable:\n"
        "1. For charts (bar, line, pie, area, scatter): Use\n```json-chart\n{{ \"type\": \"bar\", \"data\": [{{\"name\": \"A\", \"value\": 10}}] }}\n```\n"
        "2. For timelines/roadmaps: Use\n```json-timeline\n[{{\"year\": \"2024\", \"title\": \"Launch\", \"description\": \"...\"}}]\n```\n"
        "3. For KPIs/Stats: Use\n```json-kpi\n[{{\"label\": \"Revenue\", \"value\": \"$10M\", \"trend\": \"+5%\"}}]\n```\n"
        "4. For Contact info: Use\n```json-contact\n{{\"name\": \"John\", \"email\": \"x@y.com\", \"phone\": \"123\"}}\n```\n"
        "5. For Pricing: Use\n```json-pricing\n[{{\"plan\": \"Basic\", \"price\": \"$10\", \"features\": [\"A\"]}}]\n```\n"
        "6. For FAQs: Use\n```json-faq\n[{{\"question\": \"Q?\", \"answer\": \"A!\"}}]\n```\n"
        "CRITICAL FOLLOW-UP REQUIREMENT: You MUST ALWAYS predict the next 2 to 3 questions the user will ask. ALWAYS end your response with this exact format:\n```json-followups\n[\"Predicted Question 1?\", \"Predicted Question 2?\"]\n```"
    )
    system_prompt = f"{base_system_prompt}\n\n{smart_instructions}"
    
    sources = []
    context = ""
    
    if qdrant_client and embeddings:
        collection_name = f"agent_{agent_id}"
        try:
            collections = qdrant_client.get_collections().collections
            exists = any(c.name == collection_name for c in collections)
        except Exception:
            exists = False
            
        if exists:
            try:
                query_vector = embeddings.embed_query(query)
                # 2. Context Compression - Retrieve Top 15
                search_result = qdrant_client.search(
                    collection_name=collection_name,
                    query_vector=query_vector,
                    limit=15
                )
                
                # Deduplicate and merge similar chunks
                unique_chunks = {}
                for hit in search_result:
                    payload = hit.payload
                    if not payload:
                        continue
                    
                    chunk_text = payload.get("chunk_text", "").strip()
                    if not chunk_text:
                        continue
                        
                    # Strict deduplication based on exact text
                    if chunk_text not in unique_chunks:
                        # Convert cosine similarity to percentage (score is typically cosine distance)
                        conf = min(int(hit.score * 100), 100)
                        
                        unique_chunks[chunk_text] = {
                            "id": payload.get("chunk_id", str(uuid.uuid4())),
                            "title": payload.get("title", payload.get("source", "Document")),
                            "type": payload.get("source_type", "docs"),
                            "confidence": conf,
                            "preview": chunk_text[:100] + "...",
                            "original_filename": payload.get("original_filename", "")
                        }
                        
                    if len(unique_chunks) >= 5: # Keep Top 5
                        break
                
                # Group sources by title to remove duplicates
                final_sources_map = {}
                context_parts = []
                
                for text, meta in unique_chunks.items():
                    context_parts.append(text)
                    title = meta["title"]
                    if title not in final_sources_map:
                        final_sources_map[title] = meta
                    else:
                        if meta["confidence"] > final_sources_map[title]["confidence"]:
                            final_sources_map[title] = meta
                            
                sources = list(final_sources_map.values())
                context = "\n\n".join(context_parts)
                
            except Exception as e:
                logger.error(f"Search error: {e}")
                
    # Initialize Groq LLM
    try:
        llm = ChatGroq(
            groq_api_key=settings.GROQ_API_KEY,
            model_name="llama-3.1-8b-instant"
        )
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt + "\n\nKnowledge Base Context:\n{context}"),
            ("user", "{query}")
        ])
        chain = prompt | llm
        
        # 6. Streaming Output
        full_answer = ""
        async for chunk in chain.astream({"context": context, "query": query}):
            if chunk.content:
                full_answer += chunk.content
                yield f"data: {json.dumps({'chunk': chunk.content})}\n\n"
                
        latency = round(time.time() - start_time, 2)
        tokens = int(len(full_answer.split()) * 1.3)
        
        # Save to DB
        if supabase_client:
            try:
                supabase_client.table('chat_messages').insert({
                    "session_id": session_id,
                    "sender": "agent",
                    "message": full_answer,
                    "sources": sources
                }).execute()
            except Exception as e:
                logger.error(f"Failed to save agent message: {e}")
        
        # Yield final JSON payload
        final_payload = {
            "answer": full_answer,
            "sources": sources,
            "tokens": tokens,
            "latency": latency,
            "session_id": session_id
        }
        yield f"data: {json.dumps({'final': final_payload})}\n\n"
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        error_payload = {
            "error": str(e),
            "answer": "Error generating response.",
            "sources": []
        }
        yield f"data: {json.dumps(error_payload)}\n\n"
