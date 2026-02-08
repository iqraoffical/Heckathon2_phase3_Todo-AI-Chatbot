# Frontend Development Guide

## Project Structure
```
frontend/
├── CLAUDE.md                    # This file
├── package.json                # Project metadata and dependencies
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── next.config.js             # Next.js configuration
├── .env.local                 # Environment variables (not committed)
├── components/                # Reusable React components
│   ├── TaskItem.tsx           # Individual task display component
│   ├── TaskForm.tsx           # Task creation/editing form
│   ├── TaskList.tsx           # List of tasks component
│   ├── ChatInterface.tsx      # AI chatbot interface
│   └── Layout.tsx             # Main layout component
├── pages/                     # Next.js pages (if using pages router)
│   ├── index.tsx              # Home page
│   ├── dashboard.tsx          # Dashboard page
│   └── chat.tsx               # Chat page
├── app/                       # Next.js app directory (if using app router)
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   ├── tasks/                 # Tasks section
│   │   ├── page.tsx           # Tasks page
│   │   └── [...taskId]/       # Individual task page
│   └── chat/                  # Chat section
│       └── page.tsx           # Chat page
├── lib/                       # Utility functions and services
│   ├── api.ts                 # API client and request functions
│   ├── auth.ts                # Authentication utilities
│   └── types.ts               # Type definitions
├── public/                    # Static assets
│   ├── favicon.ico
│   └── logo.svg
└── styles/                    # Global styles
    └── globals.css            # Main stylesheet
```

## Dependencies
Install the required packages:
```bash
npm install
```

## Environment Variables
Create a `.env.local` file in the frontend directory with the following variables:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_JWT_SECRET=cb596cc800d58094bdcdcc48f89f48e1158fc6ad17b49cdee775b50eff63858a
```

## Running the Frontend
Start the development server:
```bash
npm run dev
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint the codebase