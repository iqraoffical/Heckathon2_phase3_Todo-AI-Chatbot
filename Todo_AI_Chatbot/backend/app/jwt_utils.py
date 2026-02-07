from datetime import datetime
from typing import Optional
import os
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlmodel import Session, select
from .database import get_session
from .models import User

# JWT configuration - using BETTER_AUTH_SECRET
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-default-secret-key-change-this")
ALGORITHM = "HS256"

security = HTTPBearer()

class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None

def verify_jwt_token(token: str) -> TokenData:
    """
    Verify a JWT token and extract user information.
    This function is designed to work with Better Auth JWT tokens.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Extract user information from the payload
        # Better Auth JWT structure typically has:
        # {
        #   "iss": "better-auth.com",
        #   "sub": "user-id",
        #   "iat": timestamp,
        #   "exp": timestamp,
        #   "session": {
        #     "userId": "user-id",
        #     "expiresAt": timestamp
        #   },
        #   "user": {
        #     "id": "user-id",
        #     "email": "user@example.com",
        #     "emailVerified": true/false,
        #     "name": "User Name"
        #   }
        # }

        # Try multiple possible locations for user ID
        user_id: str = payload.get("sub")  # Standard JWT subject

        if not user_id:
            # Check in session object
            session_data = payload.get("session", {})
            user_id = session_data.get("userId") or session_data.get("id")

        if not user_id:
            # Check in user object
            user_data = payload.get("user", {})
            user_id = user_data.get("id") or user_data.get("sub")

        # Try multiple possible locations for email
        email: str = payload.get("email")

        if not email:
            # Check in user object
            user_data = payload.get("user", {})
            email = user_data.get("email")

        if not user_id:
            raise credentials_exception

        token_data = TokenData(user_id=user_id, email=email)
    except JWTError:
        raise credentials_exception

    return token_data

async def get_current_user_from_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> User:
    """
    Dependency to get the current user from the JWT token in the Authorization header.
    This function verifies the token and retrieves the user from the database.
    """
    token = credentials.credentials

    # Verify the JWT token
    token_data = verify_jwt_token(token)

    # Get user from database based on the user ID from the token
    user = session.exec(select(User).where(User.id == token_data.user_id)).first()
    if user is None:
        # If user doesn't exist in our local database, we might need to create it
        # based on the information in the token
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found in the system"
        )

    return user