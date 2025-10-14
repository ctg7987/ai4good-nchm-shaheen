#!/usr/bin/env python3
"""
Simple build script for the API.
This just validates that the API can be imported successfully.
"""

import sys
import os

def main():
    """Main build function."""
    try:
        # Add the current directory to Python path
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        
        # Try to import the main app
        from app.main import app
        print("✅ API imports successfully")
        
        # Try to import key modules
        from app.core.settings import settings
        print("✅ Settings loaded successfully")
        
        from app.routers import health, narrative, metrics
        print("✅ All routers imported successfully")
        
        print("🎉 API build completed successfully!")
        return 0
        
    except Exception as e:
        print(f"❌ API build failed: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
