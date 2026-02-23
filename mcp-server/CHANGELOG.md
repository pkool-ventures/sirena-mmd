# Changelog

## 1.0.0 (2026-02-21)

### Added
- Initial MCP Server for AiVentures Tasks API
- `list_tasks` — List tasks with optional filters (status, priority, productId)
- `get_task` — Get a single task by ID
- `update_task_status` — Update task status
- `add_comment` — Add a comment to a task
- `list_comments` — List all comments for a task
- stdio-based transport for Claude Code integration
- API key authentication via `X-API-Key` header
- Zod-based input validation for all tool parameters
