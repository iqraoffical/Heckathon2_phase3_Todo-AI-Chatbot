import openai
from openai import OpenAI
from config import settings
import json
from typing import Dict, Any


class AIChatAgent:
    """
    AI Chat Agent that integrates with OpenAI and uses MCP tools
    """
    
    def __init__(self, tools=None):
        # Initialize OpenAI client
        if settings.OPENAI_API_KEY:
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        else:
            # If no API key is provided, we'll simulate responses
            self.client = None
        
        self.tools = tools
        self.tool_functions = {
            "add_task": self.tools.add_task if self.tools else None,
            "list_tasks": self.tools.list_tasks if self.tools else None,
            "complete_task": self.tools.complete_task if self.tools else None,
            "delete_task": self.tools.delete_task if self.tools else None,
            "update_task": self.tools.update_task if self.tools else None
        } if tools else {}
    
    async def process_message(self, user_message: str) -> str:
        """
        Process a user message and return an AI response
        """
        if not self.client:
            # Simulated response when no OpenAI API key is available
            return f"I received your message: '{user_message}'. This is a simulated response since no OpenAI API key is configured."
        
        # Define available tools
        available_tools = [
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Add a new task for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "title": {
                                "type": "string",
                                "description": "Title of the task"
                            },
                            "description": {
                                "type": "string",
                                "description": "Description of the task"
                            },
                            "due_date": {
                                "type": "string",
                                "description": "Due date in ISO format (YYYY-MM-DDTHH:MM:SS.sssZ)"
                            }
                        },
                        "required": ["title"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "List tasks for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "completed": {
                                "type": "boolean",
                                "description": "Filter by completion status (true for completed, false for incomplete, null for all)"
                            }
                        }
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "complete_task",
                    "description": "Mark a task as complete",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_id": {
                                "type": "string",
                                "description": "ID of the task to mark as complete"
                            }
                        },
                        "required": ["task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Delete a task",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_id": {
                                "type": "string",
                                "description": "ID of the task to delete"
                            }
                        },
                        "required": ["task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "update_task",
                    "description": "Update a task",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_id": {
                                "type": "string",
                                "description": "ID of the task to update"
                            },
                            "title": {
                                "type": "string",
                                "description": "New title of the task"
                            },
                            "description": {
                                "type": "string",
                                "description": "New description of the task"
                            },
                            "due_date": {
                                "type": "string",
                                "description": "New due date in ISO format"
                            },
                            "completed": {
                                "type": "boolean",
                                "description": "New completion status"
                            }
                        },
                        "required": ["task_id"]
                    }
                }
            }
        ]
        
        try:
            # Call OpenAI API with tools
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful task management assistant. Use the available tools to manage tasks for the user. Always respond in a friendly and helpful manner."
                    },
                    {
                        "role": "user",
                        "content": user_message
                    }
                ],
                tools=available_tools,
                tool_choice="auto"
            )
            
            response_message = response.choices[0].message
            tool_calls = response_message.tool_calls
            
            # If the model wants to call tools
            if tool_calls:
                # Send the info for each function call and function response to the model
                tool_results = []
                
                for tool_call in tool_calls:
                    function_name = tool_call.function.name
                    function_args = json.loads(tool_call.function.arguments)
                    
                    # Call the appropriate function
                    if function_name in self.tool_functions and self.tool_functions[function_name]:
                        try:
                            function_response = self.tool_functions[function_name](**function_args)
                            tool_results.append({
                                "tool_call_id": tool_call.id,
                                "role": "tool",
                                "name": function_name,
                                "content": json.dumps(function_response)
                            })
                        except Exception as e:
                            tool_results.append({
                                "tool_call_id": tool_call.id,
                                "role": "tool",
                                "name": function_name,
                                "content": json.dumps({"error": f"Error calling {function_name}: {str(e)}"})
                            })
                    else:
                        tool_results.append({
                            "tool_call_id": tool_call.id,
                            "role": "tool",
                            "name": function_name,
                            "content": json.dumps({"error": f"Function {function_name} not available"})
                        })
                
                # Get the final response from the model with tool results
                final_response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a helpful task management assistant. Use the available tools to manage tasks for the user. Always respond in a friendly and helpful manner."
                        },
                        {
                            "role": "user",
                            "content": user_message
                        },
                        *response.choices[0].message.tool_calls,
                        *tool_results
                    ]
                )
                
                return final_response.choices[0].message.content
            else:
                # If no tools were called, return the model's response directly
                return response_message.content or "I processed your request."
                
        except Exception as e:
            return f"Sorry, I encountered an error processing your request: {str(e)}"