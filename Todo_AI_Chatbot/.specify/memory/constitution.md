# Todo AI Chatbot Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### I. Stateless Server Architecture
Server maintains no application state; all state stored in database; Database serves as single source of truth for all application data; All API endpoints operate in stateless manner, relying on database for persistence.

### II. Reusable MCP Tools as Agent Skills
Leverage reusable MCP (Model Context Protocol) tools as specialized agent skills; Each agent skill follows standardized interface for consistent integration; MCP tools enable modular, composable agent behaviors.

### III. OpenAI Agents SDK for NLP and Tool Calling
Utilize OpenAI Agents SDK for natural language processing capabilities; Implement tool calling functionality through OpenAI Agents framework; Enable sophisticated language understanding and response generation.

### IV. Integration with Better Auth JWT
Implement secure authentication using Better Auth JWT tokens; All API endpoints require proper JWT validation; Follow industry-standard security practices for token management.

### V. Error Handling in Tools
Implement comprehensive error handling in all tools and agent skills; Handle edge cases like task not found, invalid inputs, and service failures; Provide meaningful error messages for debugging and user experience.

### VI. Modular Subagents for Specific Behaviors
Design modular subagents for specific behavioral patterns (e.g., intent detection subagent); Each subagent focuses on a single responsibility; Enable flexible composition of complex agent behaviors.

## Additional Constraints

### No Manual Code Generation
Avoid manual code generation; All code produced through automated tools and agents; Maintain consistency and reduce human error through automation.

### Follow MCP SDK Standards
Adhere strictly to MCP SDK guidelines for tool development; Ensure interoperability and standardization across all tools; Follow documented MCP patterns and practices.

### OpenAI Agents for Runner
Use OpenAI Agents framework as the primary execution environment; Leverage OpenAI's infrastructure for agent orchestration; Ensure compatibility with OpenAI Agents runtime requirements.

## Development Workflow

### Automated Testing
Implement comprehensive automated testing for all agent skills; Test error handling, edge cases, and integration points; Maintain high test coverage for reliability.

### Continuous Integration
Follow CI/CD practices for agent skill deployment; Automated validation of MCP tool compliance; Ensure backward compatibility in all updates.

## Governance
Constitution supersedes all other practices; Amendments require documentation, approval, and migration plan; All implementations must comply with stated principles and constraints.

All PRs/reviews must verify compliance; Complexity must be justified; Use this constitution for development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-02-07 | **Last Amended**: 2026-02-07
