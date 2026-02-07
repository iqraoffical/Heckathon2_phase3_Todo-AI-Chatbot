"""
Test importing the tasks router to check for errors
"""
try:
    from app.api.routers import tasks
    print("Successfully imported tasks router")
    
    # Check if the build_tasks_query function exists
    if hasattr(tasks, 'build_tasks_query'):
        print("build_tasks_query function exists")
    else:
        print("build_tasks_query function does not exist")
        
    # Check if the get_tasks endpoint exists
    if hasattr(tasks, 'get_tasks'):
        print("get_tasks endpoint exists")
    else:
        print("get_tasks endpoint does not exist")
        
    print("All imports successful!")
    
except Exception as e:
    print(f"Import error: {e}")
    import traceback
    traceback.print_exc()