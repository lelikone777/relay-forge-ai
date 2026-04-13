import { handleCors } from "./core/cors";
import { json } from "./core/responses";
import type { Env } from "./env";
import { handleChat } from "./routes/chat";
import { handleLogs } from "./routes/logs";
import { handleStatus } from "./routes/status";
import { handleStream } from "./routes/stream";
import { handleUsage } from "./routes/usage";

const notFound = (env: Env) =>
  json(env, {
    success: false,
    error: {
      code: "internal_error",
      message: "Route not found.",
      timestamp: new Date().toISOString()
    }
  }, 404);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsResponse = handleCors(request, env);

    if (corsResponse) {
      return corsResponse;
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    if (request.method === "POST" && pathname === "/api/v1/chat") {
      return handleChat(request, env);
    }

    if (request.method === "POST" && pathname === "/api/v1/stream") {
      return handleStream(request, env);
    }

    if (request.method === "GET" && pathname === "/api/v1/providers/status") {
      return handleStatus(request, env);
    }

    if (request.method === "GET" && pathname === "/api/v1/logs") {
      return handleLogs(request, env);
    }

    if (request.method === "GET" && pathname === "/api/v1/usage") {
      return handleUsage(request, env);
    }

    return notFound(env);
  }
};
