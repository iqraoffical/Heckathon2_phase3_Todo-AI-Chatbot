#!/bin/bash
# Script to start the Next.js application

echo "Starting the Task Manager application..."
echo "Make sure you have set up your environment variables in .env.local"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "Warning: .env.local file not found!"
    echo "Please create one based on the example in AUTH_SETUP.md"
fi

# Start the development server
npm run dev