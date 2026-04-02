type JsonRpcId = string | number | null;

type JsonRpcRequest = {
  jsonrpc: "2.0";
  id?: JsonRpcId;
  method: string;
  params?: unknown;
};

type JsonRpcResponse = {
  jsonrpc: "2.0";
  id: JsonRpcId;
  result?: unknown;
  error?: {
    code: number;
    message: string;
  };
};

function createResponse(id: JsonRpcId, result: unknown): JsonRpcResponse {
  return { jsonrpc: "2.0", id, result };
}

function createError(id: JsonRpcId, code: number, message: string): JsonRpcResponse {
  return {
    jsonrpc: "2.0",
    id,
    error: { code, message },
  };
}

function handleRequest(req: JsonRpcRequest): JsonRpcResponse {
  if (req.method === "initialize") {
    return createResponse(req.id ?? null, {
      serverInfo: { name: "person-search-mcp-server", version: "0.1.0" },
      capabilities: {},
    });
  }

  if (req.method === "tools/list") {
    return createResponse(req.id ?? null, {
      tools: [
        { name: "person_create", description: "Create a person" },
        { name: "person_list", description: "List/search people" },
        { name: "person_get", description: "Get person by id" },
        { name: "person_update", description: "Update person" },
        { name: "person_delete", description: "Delete person" },
      ],
    });
  }

  if (req.method === "tools/call") {
    return createResponse(req.id ?? null, {
      content: [
        {
          type: "text",
          text: "Tool execution scaffold is ready. Wire this to your app API or database.",
        },
      ],
    });
  }

  return createError(req.id ?? null, -32601, `Method not found: ${req.method}`);
}

process.stdin.setEncoding("utf8");

let buffer = "";
process.stdin.on("data", (chunk) => {
  buffer += chunk;

  const lines = buffer.split("\n");
  buffer = lines.pop() ?? "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    try {
      const req = JSON.parse(trimmed) as JsonRpcRequest;
      const res = handleRequest(req);
      process.stdout.write(`${JSON.stringify(res)}\n`);
    } catch {
      const res = createError(null, -32700, "Parse error");
      process.stdout.write(`${JSON.stringify(res)}\n`);
    }
  }
});
