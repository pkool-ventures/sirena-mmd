# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sirena is a Mermaid diagram editor with live preview, built as a Tauri v2 desktop app (also supports Android). It features a CodeMirror-based code editor with a split-pane layout and real-time Mermaid rendering.

## Commands

### Development

- `yarn dev` — Start Vite dev server only (web, port 1420)
- `yarn tauri dev` — Start full desktop app (Tauri + Vite)
- `yarn tauri android dev` — Start Android development

### Build

- `yarn build` — TypeScript check + Vite production build
- `yarn tauri build` — Full desktop app build

### MCP Server (separate project in `mcp-server/`)

- `cd mcp-server && npm run build` — Build MCP server
- `cd mcp-server && npm start` — Run MCP server

## Architecture

**Frontend (React + TypeScript + Vite):**

- `src/App.tsx` — Main layout: toolbar, split-pane with editor and preview. Manages Mermaid code state and manual render triggering (Ctrl+Enter).
- `src/components/MermaidEditor.tsx` — CodeMirror 6 editor with dark theme, markdown syntax highlighting, Ctrl/Cmd+Enter keybinding for rendering.
- `src/components/MermaidPreview.tsx` — Renders Mermaid diagrams via `mermaid.render()` with error display. Rendering is triggered explicitly (not on every keystroke) via `renderKey`.

**Desktop Shell (Tauri v2 + Rust):**

- `src-tauri/` — Tauri config, Rust backend (`lib.rs`, `main.rs`). Currently minimal, standard Tauri setup.

**MCP Server (`mcp-server/`):**

- Standalone Node.js MCP server for AiVentures task management API. Separate `package.json`, built with `@modelcontextprotocol/sdk`.

## Key Patterns

- Rendering is **not** live-on-type; user triggers render with Run button or Ctrl+Enter
- CodeMirror editor is initialized once in a `useEffect` with empty deps; external value changes sync via a second `useEffect`
- Mermaid is configured with `securityLevel: "loose"` and dark theme
- Package manager: **yarn**

## Design / Styling / Theming

Use the central theme for all components. Use variants for custom component and styleOverrides for general customization. Use `sx` for one-off layouts

- `src/theme.ts` - central theme config
