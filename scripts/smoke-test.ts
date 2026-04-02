const endpoint = process.env.APP_MCP_URL ?? "https://person-app-crud.vercel.app/api/mcp";
const apiKey = process.env.MCP_API_KEY ?? "";

type JsonRpcRequest = {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params?: unknown;
};

async function callRpc(request: JsonRpcRequest) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers["x-mcp-api-key"] = apiKey;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(`Invalid JSON from endpoint: ${text}`);
  }
}

async function main() {
  console.log(`Using endpoint: ${endpoint}`);

  const initializeResult = await callRpc({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {},
  });

  const toolsListResult = await callRpc({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
    params: {},
  });

  console.log("initialize response:");
  console.log(JSON.stringify(initializeResult, null, 2));

  console.log("\ntools/list response:");
  console.log(JSON.stringify(toolsListResult, null, 2));
}

main().catch((error) => {
  console.error("Smoke test failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
