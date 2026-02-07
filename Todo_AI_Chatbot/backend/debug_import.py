import sys
print("Python version:", sys.version)
print("Python executable:", sys.executable)

try:
    from app.main import app
    print("✓ Successfully imported app")
except ImportError as e:
    print("✗ Failed to import app:", str(e))
    import traceback
    traceback.print_exc()
except Exception as e:
    print("✗ Unexpected error:", str(e))
    import traceback
    traceback.print_exc()