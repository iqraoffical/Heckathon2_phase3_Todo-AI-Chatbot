from sqlmodel import SQLModel, create_engine
from app.database import engine
from app.models import User, Task

def test_database():
    print("Testing database connection and models...")
    
    try:
        # Create tables
        SQLModel.metadata.create_all(engine)
        print("Tables created successfully")
        
        # Test creating a session
        from sqlmodel import Session
        with Session(engine) as session:
            print("Database session created successfully")
            
        print("Database test passed!")
        return True
    except Exception as e:
        print(f"Database test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_database()