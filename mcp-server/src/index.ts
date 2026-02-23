#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const VALID_STATUSES = [
  "draft",
  "todo",
  "in_progress",
  "ready_for_testing",
  "in_testing",
  "needs_adjustments",
  "complete",
  "approved",
] as const;

const VALID_PRIORITIES = ["low", "medium", "high"] as const;
const VALID_TYPES = ["bug", "feature"] as const;

const API_URL = process.env.AIVENTURES_API_URL;
const API_KEY = process.env.AIVENTURES_API_KEY;

if (!API_URL || !API_KEY) {
  console.error(
    "Missing required environment variables: AIVENTURES_API_URL and AIVENTURES_API_KEY"
  );
  process.exit(1);
}

async function apiRequest(
  path: string,
  options: {
    method?: string;
    params?: Record<string, string>;
    body?: Record<string, unknown>;
  } = {}
): Promise<unknown> {
  const { method = "GET", params, body } = options;

  const url = new URL(API_URL!);
  url.pathname = url.pathname.replace(/\/$/, "") + path;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      "X-API-Key": API_KEY!,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      (data as { error?: string }).error || `HTTP ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

const server = new McpServer({
  name: "aiventures",
  version: "1.0.0",
});

// list_tasks
server.tool(
  "list_tasks",
  "List tasks with optional filters for status, priority, and product",
  {
    status: z
      .enum(VALID_STATUSES)
      .optional()
      .describe("Filter by task status"),
    priority: z
      .enum(VALID_PRIORITIES)
      .optional()
      .describe("Filter by priority"),
    productId: z.string().uuid().optional().describe("Filter by product ID"),
  },
  async ({ status, priority, productId }) => {
    const params: Record<string, string> = {};
    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (productId) params.product_id = productId;

    const data = await apiRequest("", { params });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    };
  }
);

// get_task
server.tool(
  "get_task",
  "Get a single task by ID",
  {
    taskId: z.string().uuid().describe("The task ID"),
  },
  async ({ taskId }) => {
    const data = await apiRequest("", { params: { id: taskId } });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    };
  }
);

// update_task_status
server.tool(
  "update_task_status",
  "Update the status of a task",
  {
    taskId: z.string().uuid().describe("The task ID"),
    status: z.enum(VALID_STATUSES).describe("The new status"),
  },
  async ({ taskId, status }) => {
    const data = await apiRequest("", {
      method: "PATCH",
      params: { id: taskId },
      body: { status },
    });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    };
  }
);

// add_comment
server.tool(
  "add_comment",
  "Add a comment to a task",
  {
    taskId: z.string().uuid().describe("The task ID"),
    content: z.string().min(1).describe("The comment text"),
  },
  async ({ taskId, content }) => {
    const data = await apiRequest("/comments", {
      method: "POST",
      body: { taskId, content },
    });
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(data, null, 2) },
      ],
    };
  }
);

// create_task
server.tool(
  "create_task",
  "Create a new task",
  {
    title: z.string().min(1).describe("Task title"),
    description: z.string().optional().describe("Task description"),
    status: z.enum(VALID_STATUSES).optional().describe("Initial status"),
    priority: z.enum(VALID_PRIORITIES).optional().describe("Task priority"),
    type: z.enum(VALID_TYPES).optional().describe("Task type"),
    productId: z.string().uuid().optional().describe("Product ID"),
    gitBranch: z.string().optional().describe("Associated git branch"),
  },
  async ({ title, description, status, priority, type, productId, gitBranch }) => {
    const body: Record<string, unknown> = { title };
    if (description) body.description = description;
    if (status) body.status = status;
    if (priority) body.priority = priority;
    if (type) body.type = type;
    if (productId) body.productId = productId;
    if (gitBranch) body.gitBranch = gitBranch;

    const data = await apiRequest("", { method: "POST", body });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    };
  }
);

// list_comments
server.tool(
  "list_comments",
  "List all comments for a task",
  {
    taskId: z.string().uuid().describe("The task ID"),
  },
  async ({ taskId }) => {
    const data = await apiRequest("/comments", {
      params: { task_id: taskId },
    });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
