# Person Search MCP Server

Standalone MCP server repository for Person Search CRUD tools.

## Purpose

This repository hosts the MCP server implementation used by Claude Desktop to manage Person records.

## Planned Tools

- `person_create(name, email, phoneNumber)`
- `person_list(query?)`
- `person_get(id)`
- `person_update(id, name?, email?, phoneNumber?)`
- `person_delete(id)`

## Quick Start

```bash
pnpm install
pnpm dev
```

## Notes

The production app integration lives at:

- Main app repo: https://github.com/Alkaeya/person-app-crud
- App MCP endpoint: `/api/mcp`
