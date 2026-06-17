from supabase import create_client, Client
from qdrant_client import QdrantClient
from ..core.config import settings
import logging

logger = logging.getLogger(__name__)

# Initialize Supabase Client
def get_supabase_client() -> Client:
    try:
        supabase: Client = create_client(
            settings.SUPABASE_URL, 
            settings.SUPABASE_SERVICE_ROLE_KEY # Use service role for backend ops
        )
        return supabase
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        return None

# Initialize Qdrant Client
def get_qdrant_client() -> QdrantClient:
    try:
        # Note: The user's .env had QDRANT_URL and QDRANT_API_KEY swapped in formatting.
        # We handle it generically assuming the URL is the URL and Key is the Key.
        # If QDRANT_URL looks like a JWT token, swap them internally.
        url = settings.QDRANT_URL
        api_key = settings.QDRANT_API_KEY
        
        if "http" not in url and "http" in api_key:
            url, api_key = api_key, url
            
        client = QdrantClient(
            url=url,
            api_key=api_key,
        )
        return client
    except Exception as e:
        logger.error(f"Failed to initialize Qdrant client: {e}")
        return None

supabase_client = get_supabase_client()
qdrant_client = get_qdrant_client()
