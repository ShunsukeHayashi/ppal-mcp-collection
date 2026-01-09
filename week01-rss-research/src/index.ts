#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import Parser from "rss-parser";

const parser = new Parser();

// Default RSS sources
const DEFAULT_SOURCES = [
  { name: "Hacker News", url: "https://hnrss.org/frontpage" },
  { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
  { name: "DEV Community", url: "https://dev.to/feed" },
];

// In-memory subscriptions
let subscriptions = [...DEFAULT_SOURCES];

const server = new Server(
  {
    name: "rss-research",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "rss_search",
        description: "Search RSS feeds for articles matching a keyword",
        inputSchema: {
          type: "object",
          properties: {
            keyword: {
              type: "string",
              description: "Keyword to search for",
            },
            limit: {
              type: "number",
              description: "Maximum number of results (default: 10)",
            },
          },
          required: ["keyword"],
        },
      },
      {
        name: "rss_subscribe",
        description: "Add a new RSS feed to the subscription list",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "RSS feed URL",
            },
            name: {
              type: "string",
              description: "Name for this feed",
            },
          },
          required: ["url", "name"],
        },
      },
      {
        name: "rss_list_sources",
        description: "List all subscribed RSS sources",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "rss_trending",
        description: "Get trending topics from RSS feeds",
        inputSchema: {
          type: "object",
          properties: {
            hours: {
              type: "number",
              description: "Look back hours (default: 24)",
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "rss_search": {
      const keyword = (args as { keyword: string; limit?: number }).keyword;
      const limit = (args as { keyword: string; limit?: number }).limit || 10;
      
      const results: any[] = [];
      
      for (const source of subscriptions) {
        try {
          const feed = await parser.parseURL(source.url);
          const matches = feed.items
            .filter((item) => {
              const text = `${item.title} ${item.contentSnippet || ""}`.toLowerCase();
              return text.includes(keyword.toLowerCase());
            })
            .slice(0, limit)
            .map((item) => ({
              title: item.title,
              link: item.link,
              published: item.pubDate,
              summary: item.contentSnippet?.slice(0, 200),
              source: source.name,
            }));
          results.push(...matches);
        } catch (e) {
          console.error(`Failed to fetch ${source.name}:`, e);
        }
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                keyword,
                total: results.length,
                articles: results.slice(0, limit),
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "rss_subscribe": {
      const { url, name: feedName } = args as { url: string; name: string };
      subscriptions.push({ name: feedName, url });
      return {
        content: [
          {
            type: "text",
            text: `Added "${feedName}" (${url}) to subscriptions.`,
          },
        ],
      };
    }

    case "rss_list_sources": {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(subscriptions, null, 2),
          },
        ],
      };
    }

    case "rss_trending": {
      const hours = (args as { hours?: number }).hours || 24;
      const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
      
      const wordFreq: Record<string, number> = {};
      
      for (const source of subscriptions) {
        try {
          const feed = await parser.parseURL(source.url);
          feed.items
            .filter((item) => new Date(item.pubDate || "") > cutoff)
            .forEach((item) => {
              const words = (item.title || "")
                .toLowerCase()
                .split(/\s+/)
                .filter((w) => w.length > 4);
              words.forEach((w) => {
                wordFreq[w] = (wordFreq[w] || 0) + 1;
              });
            });
        } catch (e) {
          console.error(`Failed to fetch ${source.name}:`, e);
        }
      }

      const trending = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([word, count]) => ({ word, count }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ hours, trending }, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("RSS Research MCP Server running");
}

main().catch(console.error);
