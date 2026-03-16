# AGENTS.md

This file provides a concise reference for AI agents and LLMs working in this repository, so the codebase does not need to be re-explored on every session.

---

## Project Overview

**`ng-webmcp`** is an Angular library that exposes web application functionality to AI agents via the [WebMCP (Web Model Context Protocol)](https://webmachinelearning.github.io/webmcp/) browser API (`navigator.modelContext`). It wraps this nascent W3C standard in idiomatic Angular patterns: a service, a method decorator, and an attribute directive.

- **Language:** TypeScript (strict mode, ES2022, `experimentalDecorators: true`)
- **Framework:** Angular 21.2.x
- **Package manager:** npm
- **Build tool:** Angular CLI + ng-packagr (library), Vite/esbuild (demo app)
- **Test runner:** Vitest (with jsdom, global mode — no imports needed for `describe`/`it`/`expect`/`vi`)

---

## Repository Structure

```
ng-webmcp/                          ← Angular CLI monorepo root
├── angular.json                    ← Workspace config (two projects: library + demo)
├── tsconfig.json                   ← Root TS config (strict, path aliases, project refs)
├── package.json                    ← Workspace scripts and all dependencies
├── CHANGELOG.md
├── README.md                       ← Primary user-facing documentation & API reference
│
├── .github/
│   └── workflows/
│       ├── ci.yml                  ← CI: build + test on push/PR to main (Node 20 & 22)
│       └── release.yml             ← Release: publish to npm on `v*` tag push
│
├── projects/
│   ├── ng-webmcp/                  ← The publishable Angular library (name: "ng-webmcp", v0.1.0)
│   │   ├── ng-package.json         ← ng-packagr config; dest: ../../dist/ng-webmcp
│   │   ├── package.json            ← Library manifest; peer deps: @angular/core + @angular/common ^21.2.0
│   │   ├── tsconfig.lib.json       ← Dev TS config
│   │   ├── tsconfig.lib.prod.json  ← Prod TS config (partial Ivy compilation)
│   │   ├── tsconfig.spec.json      ← Test TS config (vitest/globals types)
│   │   └── src/
│   │       ├── public-api.ts       ← Primary entry point; all public exports
│   │       └── lib/
│   │           ├── services/
│   │           │   ├── webmcp.service.ts        ← Core service
│   │           │   └── webmcp.service.spec.ts
│   │           ├── decorators/
│   │           │   ├── webmcp-tool.decorator.ts    ← @WebmcpTool method decorator + registerDecoratedTools()
│   │           │   ├── webmcp-tool-registrar.ts    ← WebmcpToolRegistrar abstract base class
│   │           │   └── webmcp-tool.decorator.spec.ts
│   │           ├── directives/
│   │           │   ├── webmcp-tool.directive.ts ← [webmcpTool] attribute directive
│   │           │   └── webmcp-tool.directive.spec.ts
│   │           ├── tokens/
│   │           │   └── webmcp-config.token.ts   ← WEBMCP_CONFIG InjectionToken + defaults
│   │           ├── types/
│   │           │   └── webmcp.types.ts          ← All TypeScript interfaces/types
│   │           ├── ng-webmcp.module.ts           ← WebmcpModule with forRoot() for NgModule apps
│   │           └── provide-webmcp.ts             ← provideWebmcp() for standalone apps
│   │
│   │   └── testing/                ← Secondary entry point (ng-webmcp/testing)
│   │       ├── ng-package.json
│   │       └── src/
│   │           ├── public-api.ts   ← Exports installWebMcpPolyfill
│   │           └── webmcp-mock.ts  ← navigator.modelContext mock polyfill
│   │
│   └── webmcp-demo/                ← Standalone Angular demo application
│       └── src/
│           ├── main.ts             ← Bootstrap; installs polyfill before Angular starts
│           └── app/
│               ├── app.ts          ← Root App component (uses directive + service)
│               ├── app.config.ts   ← ApplicationConfig with provideWebmcp()
│               ├── app.routes.ts   ← Empty routes
│               └── product.service.ts ← Demo service using @WebmcpTool + WebmcpToolRegistrar
│
└── dist/ng-webmcp/                 ← Build output (git-ignored); produced by `npm run build:lib`
```

---

## Key Source Files

| File                                                             | Role                                                                                                                                                                                   |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `projects/ng-webmcp/src/public-api.ts`                           | Single barrel export for the entire public API                                                                                                                                         |
| `projects/ng-webmcp/src/lib/services/webmcp.service.ts`          | `WebmcpService`: wraps `navigator.modelContext`; `registerTool()`, `unregisterTool()`, `getRegisteredTools()`, `isSupported()` (Angular Signal); SSR-safe; auto-cleans on `DestroyRef` |
| `projects/ng-webmcp/src/lib/decorators/webmcp-tool.decorator.ts` | `@WebmcpTool(schema)` method decorator; stores metadata in a module-level `Map`; companion: `registerDecoratedTools(instance, service)`                                                |
| `projects/ng-webmcp/src/lib/decorators/webmcp-tool-registrar.ts` | `WebmcpToolRegistrar` abstract base class; extends it to get automatic tool registration without a manual constructor call                                                             |
| `projects/ng-webmcp/src/lib/directives/webmcp-tool.directive.ts` | `[webmcpTool]` standalone directive; inputs: `toolName`, `toolDescription`, `inputSchema`; output: `toolInvoked` EventEmitter                                                          |
| `projects/ng-webmcp/src/lib/tokens/webmcp-config.token.ts`       | `WEBMCP_CONFIG` injection token; defaults: `autoInit: true`, `logLevel: 'warn'`, `fallbackBehavior: 'warn'`                                                                            |
| `projects/ng-webmcp/src/lib/types/webmcp.types.ts`               | `JsonSchemaProperty`, `WebMcpInputSchema`, `WebMcpToolSchema`, `WebMcpToolDefinition`, `WebMcpToolResult`, `WebMcpConfig`, `ModelContextApi`                                           |
| `projects/ng-webmcp/src/lib/ng-webmcp.module.ts`                 | `WebmcpModule.forRoot(config?)` for NgModule-based apps                                                                                                                                |
| `projects/ng-webmcp/src/lib/provide-webmcp.ts`                   | `provideWebmcp(config?)` for standalone apps                                                                                                                                           |
| `projects/ng-webmcp/testing/src/webmcp-mock.ts`                  | `installWebMcpPolyfill()`: installs a mock `navigator.modelContext` for testing/dev                                                                                                    |

---

## Common Commands

```bash
# Serve the demo app (localhost:4200)
npm start

# Build the library to dist/ng-webmcp/
npm run build:lib

# Run library unit tests (watch mode off)
ng test ng-webmcp --watch=false

# Run all tests
npm test

# Build the demo app (production)
npm run build

# Dry-run pack (verify library output before publish)
npm run pack:lib
```

---

## TypeScript Path Aliases

Defined in root `tsconfig.json`:

| Alias               | Source (dev)                                     | Built (dist)               |
| ------------------- | ------------------------------------------------ | -------------------------- |
| `ng-webmcp`         | `./projects/ng-webmcp/src/public-api.ts`         | `./dist/ng-webmcp`         |
| `ng-webmcp/testing` | `./projects/ng-webmcp/testing/src/public-api.ts` | `./dist/ng-webmcp/testing` |

---

## Testing

- **Runner:** Vitest with jsdom; test globals enabled (no imports needed)
- **Angular helper:** `TestBed` from `@angular/core/testing`
- **Polyfill:** Each spec file installs an inline `navigator.modelContext` mock (see `webmcp-mock.ts`) and tears it down in `afterEach`
- **Test files:** Co-located with source, `*.spec.ts` suffix
  - `webmcp.service.spec.ts` — 7 cases: support detection, tool registration/unregistration, fallback behaviors
  - `webmcp-tool.decorator.spec.ts` — 2 cases: metadata storage, `registerDecoratedTools` wiring
  - `webmcp-tool.directive.spec.ts` — 3 cases: register on init, unregister on destroy, `toolInvoked` emission

---

## Architecture Notes

- **SSR safety:** All `navigator` access in `WebmcpService` is guarded by `isPlatformBrowser()`.
- **Tree-shaking:** `"sideEffects": false` in the library's `package.json`; all directives/components are standalone.
- **Zero runtime deps:** Only peer deps are `@angular/core` and `@angular/common`.
- **Decorator registry:** `@WebmcpTool` uses a module-level `Map<Function, WebmcpToolMeta[]>` — not Reflect metadata.
- **Auto-registration:** `WebmcpToolRegistrar` is the preferred pattern; it calls `inject(WebmcpService)` and `registerDecoratedTools()` automatically in its constructor. Use `registerDecoratedTools()` directly only when the class already extends another base class.
- **Selector prefix:** `webmcp` for library; `app` for demo.

---

## CI / Release

- **CI** (`.github/workflows/ci.yml`): runs on push/PR to `main`; builds + tests on Node 20 and 22.
- **Release** (`.github/workflows/release.yml`): triggered by a `v*` tag; validates the tag matches `projects/ng-webmcp/package.json` version, builds the library, dry-run packs, then publishes via npm Trusted Publishing (no `NPM_TOKEN` needed).

---

## Browser Support

The real `navigator.modelContext` API requires Chrome 146+ Canary with `chrome://flags/#web-mcp` enabled. Use `installWebMcpPolyfill()` from `ng-webmcp/testing` during development to work without the flag.
