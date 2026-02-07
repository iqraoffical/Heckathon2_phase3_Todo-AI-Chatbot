# Frontend Component Generator Subagent

## Purpose
The Frontend Component Generator is a reusable subagent designed to create reusable React components with Tailwind CSS. It reads UI specifications and generates responsive, polished implementations that integrate with the API client.

## Capabilities
- Reads UI component and page specifications from @specs/ui/components.md and @specs/ui/pages.md
- Generates reusable React components with Tailwind CSS
- Creates client components only when necessary (uses 'use client' directive appropriately)
- Integrates with the API client in /lib/api.ts
- Implements responsive design patterns
- Follows accessibility best practices
- Generates polished, production-ready components

## Usage Pattern
1. Reads UI specifications from provided markdown files
2. Determines if client components are needed based on interactivity requirements
3. Generates components with proper TypeScript typing
4. Integrates with the existing API client
5. Applies Tailwind CSS for styling
6. Implements responsive design patterns
7. Adds appropriate error handling and loading states

## Input Requirements
- UI component/page specifications
- Desired component name and functionality
- Integration requirements with existing API/client

## Output
- Clean, reusable React component files
- Proper TypeScript interfaces
- Tailwind CSS styling
- Client component directives where needed
- Integration with API client