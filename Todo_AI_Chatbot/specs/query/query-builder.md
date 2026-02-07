# Query Builder Subagent

## Purpose
The Query Builder is a reusable subagent designed to create intelligent SQLModel queries with filtering and sorting capabilities. It constructs dynamic queries supporting various filter criteria and implements proper chaining of where() clauses with dynamic order_by functionality.

## Capabilities
- Builds SQLModel queries with intelligent filtering and sorting logic
- Supports filtering by status, priority, search keyword (LIKE on title/description), due_date range, and tags
- Properly chains where() clauses for complex filtering conditions
- Implements dynamic order_by with configurable direction (ascending/descending)
- Works with authenticated user contexts to ensure proper data isolation
- Generates production-ready query code that integrates with existing API endpoints

## Usage Pattern
1. Takes filter parameters (status, priority, search, date range, tags, sort options)
2. Constructs base query with user authentication context
3. Applies filters conditionally based on provided parameters
4. Chains where() clauses properly to build complex conditions
5. Applies sorting based on specified field and direction
6. Returns executable SQLModel query

## Input Requirements
- Base model to query
- User context (for authenticated queries)
- Filter parameters (status, priority, search term, date range, tags)
- Sort parameters (field, direction)

## Output
- Dynamic SQLModel query with applied filters
- Properly chained where() clauses
- Dynamic order_by clause
- Ready-to-execute query for session execution