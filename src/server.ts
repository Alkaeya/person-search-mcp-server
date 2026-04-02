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

const APP_MCP_URL = process.env.APP_MCP_URL ?? "https://person-app-crud.vercel.app/api/mcp";
const MCP_API_KEY = process.env.MCP_API_KEY ?? "";

function createError(id: JsonRpcId, code: number, message: string): JsonRpcResponse {
  return {
    jsonrpc: "2.0",
    id,
    error: { code, message },
  };
}

async function forwardRequest(req: JsonRpcRequest): Promise<JsonRpcResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (MCP_API_KEY) {
      headers["x-mcp-api-key"] = MCP_API_KEY;
    }

    const response = await fetch(APP_MCP_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(req),
    });

    const text = await response.text();

    if (!text) {
      return createError(req.id ?? null, -32000, "Empty response from upstream MCP endpoint");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return createError(req.id ?? null, -32700, "Upstream returned invalid JSON");
    }

    if (typeof parsed === "object" && parsed !== null && "jsonrpc" in parsed) {
      return parsed as JsonRpcResponse;
    }

    return createError(req.id ?? null, -32603, "Unexpected upstream response format");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reach upstream MCP endpoint";
    return createError(req.id ?? null, -32001, message);
  }
}

process.stdin.setEncoding("utf8");

let buffer = "";

async function processLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed) {
    return;
  }

  try {
    const req = JSON.parse(trimmed) as JsonRpcRequest;

    if (req.jsonrpc !== "2.0" || typeof req.method !== "string") {
      const res = createError(req.id ?? null, -32600, "Invalid Request");
      process.stdout.write(`${JSON.stringify(res)}\n`);
      return;
    }

    const res = await forwardRequest(req);
    process.stdout.write(`${JSON.stringify(res)}\n`);
  } catch {
    const res = createError(null, -32700, "Parse error");
    process.stdout.write(`${JSON.stringify(res)}\n`);
  }
}

process.stdin.on("data", (chunk) => {
  buffer += chunk;

  const lines = buffer.split("\n");
  buffer = lines.pop() ?? "";

  for (const line of lines) {
    void processLine(line);
  }
});
