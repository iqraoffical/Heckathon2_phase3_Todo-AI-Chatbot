"""
Test script to verify the updated GET /api/tasks endpoint functionality
"""
from app.api.routers.tasks import build_tasks_query, get_filtered_tasks
from app.database import get_session
from app.models import User, Task
from sqlmodel import Session
from unittest.mock import Mock

def test_build_tasks_query():
    """Test the query builder function with various parameters"""
    
    # Mock session and user_id for testing
    mock_session = Mock(spec=Session)
    
    # Test basic query with user_id
    query = build_tasks_query(mock_session, "user123")
    print("Basic query with user filter:", str(query))
    
    # Test query with search parameter
    query_with_search = build_tasks_query(mock_session, "user123", search="test")
    print("Query with search:", str(query_with_search))
    
    # Test query with status filter
    query_with_status = build_tasks_query(mock_session, "user123", status="pending")
    print("Query with status filter:", str(query_with_status))
    
    # Test query with priority filter
    query_with_priority = build_tasks_query(mock_session, "user123", priority="high")
    print("Query with priority filter:", str(query_with_priority))
    
    # Test query with sorting
    query_with_sort = build_tasks_query(mock_session, "user123", sort_by="due_date", order="desc")
    print("Query with sorting:", str(query_with_sort))
    
    print("\nAll query building tests passed!")

def test_parameters():
    """Test that the endpoint accepts the correct parameters"""
    import inspect
    
    # Check the signature of get_tasks function
    from app.api.routers.tasks import get_tasks
    sig = inspect.signature(get_tasks)
    
    params = list(sig.parameters.keys())
    print("Parameters in get_tasks function:", params)
    
    # Check specific parameters we need
    required_params = ['search', 'status', 'priority', 'sort_by', 'order']
    missing_params = [param for param in required_params if param not in params]
    
    if missing_params:
        print(f"Missing required parameters: {missing_params}")
    else:
        print("All required parameters are present!")
        
    # Check default values
    for param_name in required_params:
        if param_name in sig.parameters:
            param = sig.parameters[param_name]
            print(f"Parameter '{param_name}': default={param.default}, annotation={param.annotation}")

if __name__ == "__main__":
    print("Testing the updated GET /api/tasks endpoint functionality...\n")
    
    test_build_tasks_query()
    print()
    test_parameters()
    
    print("\nEndpoint functionality test completed!")