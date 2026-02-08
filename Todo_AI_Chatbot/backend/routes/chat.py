from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from auth import get_current_user_id
from models import (
    Conversation, 
    Message, 
    ChatRequest, 
    ChatResponse, 
    ConversationResponse, 
    MessageResponse
)
from db import get_session
from mcp_tools import MCPTools
from ai_agents import AIChatAgent
import uuid

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(
    user_id: uuid.UUID,
    chat_request: ChatRequest,
    session: Session = Depends(get_session)
):
    # Verify that the user_id in the path matches the authenticated user
    current_user_id = get_current_user_id()
    if current_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to chat for this user"
        )
    
    # Find or create a conversation for this user
    conversation_query = select(Conversation).where(Conversation.user_id == user_id)
    conversation = session.exec(conversation_query).first()
    
    if not conversation:
        # Create a new conversation
        conversation = Conversation(user_id=user_id, title=f"Conversation with {user_id}")
        session.add(conversation)
        session.commit()
        session.refresh(conversation)
    
    # Save the user's message
    user_message = Message(
        conversation_id=conversation.id,
        role="user",
        content=chat_request.message
    )
    session.add(user_message)
    session.commit()
    
    # Initialize MCP tools for this user
    mcp_tools = MCPTools(user_id=user_id, db_session=session)
    
    # Initialize the AI agent with MCP tools
    ai_agent = AIChatAgent(tools=mcp_tools)
    
    # Get response from AI agent
    ai_response = await ai_agent.process_message(chat_request.message)
    
    # Save the AI's response
    ai_message = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=ai_response
    )
    session.add(ai_message)
    session.commit()
    
    return ChatResponse(response=ai_response, conversation_id=conversation.id)