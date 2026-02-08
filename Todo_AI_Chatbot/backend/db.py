from sqlmodel import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from config import settings

# Synchronous engine and session
sync_engine = create_engine(settings.DATABASE_URL)
SyncSession = sessionmaker(bind=sync_engine, autocommit=False, autoflush=False)

# Asynchronous engine and session
async_engine = create_async_engine(settings.DATABASE_URL)
AsyncSession = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)


async def get_async_session():
    async with AsyncSession() as session:
        yield session


async def create_db_and_tables():
    """Create database tables"""
    from models import User, Task, Conversation, Message  # Import here to avoid circular imports
    from sqlmodel import SQLModel
    
    async with async_engine.begin() as conn:
        # Create tables
        await conn.run_sync(SQLModel.metadata.create_all)


def get_session():
    """Get synchronous session"""
    session = SyncSession()
    try:
        yield session
    finally:
        session.close()