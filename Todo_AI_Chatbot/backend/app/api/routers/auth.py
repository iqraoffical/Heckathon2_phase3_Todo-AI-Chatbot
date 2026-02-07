from datetime import datetime, timedelta
from typing import Optional
import os
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlmodel import Session, select
from ...database import get_session
from ...models import User
from ...jwt_utils import get_current_user_from_token

router = APIRouter()
security = HTTPBearer()

# JWT configuration - should match Better Auth configuration
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-default-secret-key-change-this")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Initialize password hashing context
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    # Initialize password hashing context
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# This function is kept for compatibility but will be replaced by the one in jwt_utils
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), session: Session = Depends(get_session)) -> User:
    return await get_current_user_from_token(credentials, session)

# These endpoints are kept for compatibility with existing clients
# In a real Better Auth integration, these would be handled by the Better Auth client
@router.post("/sign-up", response_model=Token)
def sign_up(user: UserCreate, session: Session = Depends(get_session)):
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password
    hashed_password = get_password_hash(user.password)

    # Create new user
    db_user = User(email=user.email, hashed_password=hashed_password, name=user.name)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Create access token with user ID instead of email
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": db_user.id}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/sign-in", response_model=Token)
def sign_in(user_credentials: UserLogin, session: Session = Depends(get_session)):
    # Find user in database
    user = session.exec(select(User).where(User.email == user_credentials.email)).first()
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token with user ID
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

# Add a test endpoint to verify JWT token validation
@router.get("/verify-token")
def verify_token(current_user: User = Depends(get_current_user_from_token)):
    return {"user_id": current_user.id, "email": current_user.email, "name": current_user.name}