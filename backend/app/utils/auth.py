# backend/app/utils/auth.py
from fastapi import Security, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from .db import supabase_client

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Retrieve and verify the currently logged-in user from the Supabase JWT token.
    Raises 401 Unauthorized if the token is invalid or expired.
    """
    token = credentials.credentials
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token missing"
        )
        
    try:
        # Call Supabase Auth to verify the JWT token
        response = supabase_client.auth.get_user(token)
        if not response or not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authorization token"
            )
        return response.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )

async def get_optional_user(authorization: Optional[str] = Header(None)) -> Optional[any]:
    """
    Optional auth helper. Returns User object if a valid Bearer token is provided, 
    otherwise returns None without raising an HTTP error.
    """
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    try:
        response = supabase_client.auth.get_user(token)
        if response and response.user:
            return response.user
    except Exception:
        pass
    return None
