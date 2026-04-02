# Person Search MCP Server

Standalone MCP bridge repository for Person Search CRUD tools.

## Purpose

This server forwards MCP JSON-RPC requests to your deployed app endpoint:

- `https://person-app-crud.vercel.app/api/mcp`

## Environment Variables

Create a `.env` file (or set env vars in your shell):

```bash
APP_MCP_URL=https://person-app-crud.vercel.app/api/mcp
MCP_API_KEY=your_same_mcp_api_key
```

`MCP_API_KEY` is optional for local testing, but required if your app endpoint enforces header auth.

## Quick Start

```bash
pnpm install
pnpm dev
```

## Smoke Test

Run a quick endpoint check for `initialize` and `tools/list`:

```bash
pnpm smoke
```

## Claude Desktop Bridge Example

```json
{
  "mcpServers": {
    "person-crud": {
      "command": "npx",
      "args": ["-y", "tsx", "src/server.ts"],
      "env": {
        "APP_MCP_URL": "https://person-app-crud.vercel.app/api/mcp",
        "MCP_API_KEY": "your_same_mcp_api_key"
      }
    }
  }
}
```

## Notes

- Main app repository: https://github.com/Alkaeya/person-app-crud
- This repo is a transport bridge, not a second database source.
