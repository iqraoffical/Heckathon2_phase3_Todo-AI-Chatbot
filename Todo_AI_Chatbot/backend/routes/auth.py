from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import jwt
import uuid
from sqlmodel import Session, select
from db import get_session
from models import User
from passlib.context import CryptContext
from config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class SignInRequest(BaseModel):
    email: str
    password: str


class SignUpRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.BETTER_AUTH_SECRET, algorithm="HS256")
    return encoded_jwt


@router.post("/sign-in", response_model=AuthResponse)
async def sign_in(request: SignInRequest, session: Session = Depends(get_session)):
    # Find user by email
    statement = select(User).where(User.email == request.email)
    result = session.exec(statement)
    user = result.first()
    
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(hours=24)  # 24 hours
    access_token = create_access_token(
        data={"user_id": str(user.id), "email": user.email}, 
        expires_delta=access_token_expires
    )
    
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user={
            "id": str(user.id),
            "email": user.email,
            "name": user.name
        }
    )


@router.post("/sign-up", response_model=AuthResponse)
async def sign_up(request: SignUpRequest, session: Session = Depends(get_session)):
    # Check if user already exists
    statement = select(User).where(User.email == request.email)
    result = session.exec(statement)
    existing_user = result.first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash the password
    hashed_password = hash_password(request.password)
    
    # Create new user
    user = User(
        id=uuid.uuid4(),
        email=request.email,
        hashed_password=hashed_password,
        name=request.name or request.email.split('@')[0]  # Use part of email as name if not provided
    )
    
    session.add(user)
    session.commit()
    session.refresh(user)
    
    # Create access token
    access_token_expires = timedelta(hours=24)  # 24 hours
    access_token = create_access_token(
        data={"user_id": str(user.id), "email": user.email}, 
        expires_delta=access_token_expires
    )
    
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user={
            "id": str(user.id),
            "email": user.email,
            "name": user.name
        }
    )


@router.get("/verify-token")
async def verify_token(authorization: str = None):
    """Verify the JWT token and return user info"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = authorization[7:]  # Remove "Bearer " prefix
    
    try:
        payload = jwt.decode(token, settings.BETTER_AUTH_SECRET, algorithms=["HS256"])
        user_id: str = payload.get("user_id")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Verify user exists in database
        # Using a new session for this lookup
        from db import sync_engine
        from sqlalchemy.orm import sessionmaker
        
        SyncSession = sessionmaker(bind=sync_engine, autocommit=False, autoflush=False)
        with SyncSession() as session:
            statement = select(User).where(User.id == uuid.UUID(user_id))
            result = session.exec(statement)
            user = result.first()
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found",
                    headers={"WWW-Authenticate": "Bearer"},
                )
        
        return {
            "id": str(user.id),
            "email": user.email,
            "name": user.name
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.post("/sign-out")
async def sign_out():
    """Simple sign out endpoint"""
    return {"message": "Signed out successfully"}