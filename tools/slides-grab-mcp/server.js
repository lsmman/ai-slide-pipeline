#!/usr/bin/env node
// MCP stdio server wrapping the slides-grab CLI as function-calling tools.
// Registered in .mcp.json — used by Claude Code while building PPT decks.
const path = require("path");
const { execFile } = require("child_process");
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");

const ROOT = path.resolve(__dirname, "..", "..");
const BIN = path.join(ROOT, "node_modules", ".bin", "slides-grab");

function run(args, timeoutMs = 300000) {
  return new Promise((resolve) => {
    execFile(BIN, args, { cwd: ROOT, timeout: timeoutMs, maxBuffer: 32 * 1024 * 1024 }, (err, stdout, stderr) => {
      const out = [stdout, stderr].filter(Boolean).join("\n---stderr---\n").trim();
      if (err) resolve({ ok: false, text: `EXIT ${err.code ?? "signal " + err.signal}\n${out}` });
      else resolve({ ok: true, text: out || "(no output)" });
    });
  });
}

const asResult = (r) => ({ content: [{ type: "text", text: r.text }], isError: !r.ok });

const server = new McpServer({ name: "slides-grab", version: "1.0.0" });

server.tool(
  "list_templates",
  "List all available slide templates (local overrides + package built-ins)",
  {},
  async () => asResult(await run(["list-templates"]))
);

server.tool(
  "show_template",
  "Print the contents of a slide template file",
  { name: z.string().describe("template name from list_templates") },
  async ({ name }) => asResult(await run(["show-template", name]))
);

server.tool(
  "list_styles",
  "List bundled design styles usable during slide generation",
  {},
  async () => asResult(await run(["list-styles"]))
);

server.tool(
  "show_design",
  "Print the design summary for a local design markdown file or bundled style id",
  { ref: z.string().describe("DESIGN.md path or bundled style id from list_styles") },
  async ({ ref }) => asResult(await run(["show-design", ref]))
);

server.tool(
  "validate",
  "Run structured Playwright-based validation (lint) on slide HTML files. Run after every slide edit.",
  {
    slides_dir: z.string().describe("slide directory, relative to project root"),
    format: z.enum(["concise", "json", "json-full"]).optional(),
    slide: z.string().optional().describe("validate only this slide file"),
  },
  async ({ slides_dir, format, slide }) => {
    const args = ["validate", "--slides-dir", slides_dir, "--format", format || "concise"];
    if (slide) args.push("--slide", slide);
    return asResult(await run(args));
  }
);

server.tool(
  "build_viewer",
  "Build viewer.html from slide HTML files for browsing the deck",
  { slides_dir: z.string() },
  async ({ slides_dir }) => asResult(await run(["build-viewer", "--slides-dir", slides_dir]))
);

server.tool(
  "render_png",
  "Render slide HTML files to one PNG per slide",
  {
    slides_dir: z.string(),
    output_dir: z.string().optional(),
    resolution: z.enum(["720p", "1080p", "1440p", "2160p", "4k"]).optional(),
  },
  async ({ slides_dir, output_dir, resolution }) => {
    const args = ["png", "--slides-dir", slides_dir, "--resolution", resolution || "1080p"];
    if (output_dir) args.push("--output-dir", output_dir);
    return asResult(await run(args, 600000));
  }
);

server.tool(
  "export_pdf",
  "Convert slide HTML files to PDF. Requires a recorded design_gate verdict first.",
  {
    slides_dir: z.string(),
    output: z.string().optional().describe("output PDF path"),
    mode: z.enum(["capture", "print"]).optional().describe("capture=visual fidelity, print=searchable text"),
    resolution: z.enum(["720p", "1080p", "1440p", "2160p", "4k"]).optional(),
  },
  async ({ slides_dir, output, mode, resolution }) => {
    const args = ["pdf", "--slides-dir", slides_dir, "--mode", mode || "capture", "--resolution", resolution || "1080p"];
    if (output) args.push("--output", output);
    return asResult(await run(args, 600000));
  }
);

server.tool(
  "export_pptx",
  "Convert slide HTML files to experimental/unstable PPTX. Requires a recorded design_gate verdict first.",
  {
    slides_dir: z.string(),
    output: z.string().optional(),
    resolution: z.enum(["720p", "1080p", "1440p", "2160p", "4k"]).optional(),
  },
  async ({ slides_dir, output, resolution }) => {
    const args = ["convert", "--slides-dir", slides_dir, "--resolution", resolution || "1080p"];
    if (output) args.push("--output", output);
    return asResult(await run(args, 600000));
  }
);

server.tool(
  "design_gate",
  "Record the required visual QA gate evidence before export (renders PNG evidence + stores verdict)",
  {
    slides_dir: z.string(),
    verdict: z.enum(["proceed", "revise", "rethink"]),
    pass_a_report: z.string().optional().describe("Pass A review report file path"),
    pass_b_report: z.string().optional().describe("Pass B review report file path"),
  },
  async ({ slides_dir, verdict, pass_a_report, pass_b_report }) => {
    const args = ["design-gate", "--slides-dir", slides_dir, "--verdict", verdict];
    if (pass_a_report) args.push("--pass-a-report", pass_a_report);
    if (pass_b_report) args.push("--pass-b-report", pass_b_report);
    return asResult(await run(args, 600000));
  }
);

server.tool(
  "generate_image",
  "Generate an AI image asset into <slides_dir>/assets (default provider god-tibo uses local Codex ChatGPT login; no API key)",
  {
    prompt: z.string(),
    slides_dir: z.string(),
    name: z.string().optional().describe("asset basename without extension"),
    provider: z.enum(["god-tibo", "codex", "nano-banana"]).optional(),
    aspect_ratio: z.string().optional().describe("e.g. 16:9 (default)"),
  },
  async ({ prompt, slides_dir, name, provider, aspect_ratio }) => {
    const args = ["image", "--prompt", prompt, "--slides-dir", slides_dir];
    if (name) args.push("--name", name);
    if (provider) args.push("--provider", provider);
    if (aspect_ratio) args.push("--aspect-ratio", aspect_ratio);
    return asResult(await run(args, 600000));
  }
);

(async () => {
  await server.connect(new StdioServerTransport());
})();
