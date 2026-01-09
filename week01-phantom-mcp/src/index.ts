#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { chromium, Browser, Page } from "playwright";

let browser: Browser | null = null;
let page: Page | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

async function getPage(): Promise<Page> {
  if (!page) {
    const b = await getBrowser();
    page = await b.newPage();
  }
  return page;
}

const server = new Server(
  { name: "phantom", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "phantom_navigate",
      description: "Navigate to a URL",
      inputSchema: {
        type: "object",
        properties: { url: { type: "string" } },
        required: ["url"],
      },
    },
    {
      name: "phantom_screenshot",
      description: "Take a screenshot",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string" },
          fullPage: { type: "boolean" },
        },
      },
    },
    {
      name: "phantom_click",
      description: "Click an element",
      inputSchema: {
        type: "object",
        properties: { selector: { type: "string" } },
        required: ["selector"],
      },
    },
    {
      name: "phantom_type",
      description: "Type text into an element",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string" },
          text: { type: "string" },
        },
        required: ["selector", "text"],
      },
    },
    {
      name: "phantom_extract",
      description: "Extract text from elements",
      inputSchema: {
        type: "object",
        properties: { selector: { type: "string" } },
        required: ["selector"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const p = await getPage();

  switch (name) {
    case "phantom_navigate": {
      const { url } = args as { url: string };
      await p.goto(url, { waitUntil: "domcontentloaded" });
      return {
        content: [{ type: "text", text: `Navigated to ${url}` }],
      };
    }
    case "phantom_screenshot": {
      const { selector, fullPage } = args as { selector?: string; fullPage?: boolean };
      const buffer = selector
        ? await p.locator(selector).screenshot()
        : await p.screenshot({ fullPage: fullPage ?? false });
      return {
        content: [
          { type: "text", text: "Screenshot captured" },
          { type: "image", data: buffer.toString("base64"), mimeType: "image/png" },
        ],
      };
    }
    case "phantom_click": {
      const { selector } = args as { selector: string };
      await p.click(selector);
      return { content: [{ type: "text", text: `Clicked ${selector}` }] };
    }
    case "phantom_type": {
      const { selector, text } = args as { selector: string; text: string };
      await p.fill(selector, text);
      return { content: [{ type: "text", text: `Typed into ${selector}` }] };
    }
    case "phantom_extract": {
      const { selector } = args as { selector: string };
      const texts = await p.locator(selector).allTextContents();
      return { content: [{ type: "text", text: JSON.stringify(texts, null, 2) }] };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
