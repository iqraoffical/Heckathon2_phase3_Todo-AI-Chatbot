@echo off
REM Batch script to start the Next.js application

echo Starting the Task Manager application...
echo Make sure you have set up your environment variables in .env.local

REM Check if .env.local exists
IF NOT EXIST .env.local (
    echo Warning: .env.local file not found!
    echo Please create one based on the example in AUTH_SETUP.md
)

REM Start the development server
npm run dev