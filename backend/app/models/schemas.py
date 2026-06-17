from pydantic import BaseModel
from typing import List, Optional, Any

class AgentDetails(BaseModel):
    name: str
    description: str
    role: str
    avatar: Optional[str] = "Bot"

class FAQ(BaseModel):
    question: str
    answer: str

class KnowledgeBase(BaseModel):
    files: List[str] = [] # Local paths to uploaded files
    website_urls: List[str] = []
    faqs: List[FAQ] = []

class MemoryConfig(BaseModel):
    session_memory_enabled: bool = True
    long_term_memory_enabled: bool = False
    retention_period_days: Any = 90 # int or string 'infinite'

class Channels(BaseModel):
    website: bool = False
    whatsapp: bool = False
    telegram: bool = False
    voice: bool = False
    api: bool = False

class CreateAgentRequest(BaseModel):
    agent_details: AgentDetails
    knowledge_base: KnowledgeBase
    memory_config: MemoryConfig
    channels: Channels

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    sources: List[dict] = []
    session_id: Optional[str] = None

class UploadResponse(BaseModel):
    success: bool
    file_path: str
    file_name: str

class DeployResponse(BaseModel):
    success: bool
    agent_id: str
    status: str

class SessionResponse(BaseModel):
    id: str
    agent_id: str
    session_name: str
    created_at: str

class MessageResponse(BaseModel):
    id: str
    session_id: str
    sender: str
    message: str
    sources: List[dict]
    created_at: str

