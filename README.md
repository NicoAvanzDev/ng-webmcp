# ng-webmcp

[![CI](https://github.com/NicoAvanzDev/ng-webmcp/actions/workflows/ci.yml/badge.svg)](https://github.com/NicoAvanzDev/ng-webmcp/actions/workflows/ci.yml)

Angular library for the [WebMCP (Web Model Context Protocol)](https://webmachinelearning.github.io/webmcp/) browser API. Expose your Angular application as an AI-agent-ready tool provider using idiomatic Angular patterns.

## What is WebMCP?

WebMCP is a W3C Community Group standard that allows web pages to expose structured JavaScript tools to AI agents and assistive technologies via `navigator.modelContext`. Think of it as turning a webpage into an MCP server — entirely client-side.

## Installation

```bash
npm install ng-webmcp
```

## Quick Start

### Standalone Application

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideWebmcp } from 'ng-webmcp';

bootstrapApplication(AppComponent, {
  providers: [provideWebmcp({ fallbackBehavior: 'warn' })],
});
```

### NgModule Application

```typescript
import { WebmcpModule } from 'ng-webmcp';

@NgModule({
  imports: [WebmcpModule.forRoot({ fallbackBehavior: 'warn' })],
})
export class AppModule {}
```

### Register a Tool via Service

```typescript
import { inject } from '@angular/core';
import { WebmcpService, WebmcpTool, registerDecoratedTools } from 'ng-webmcp';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private webmcp = inject(WebmcpService);

  constructor() {
    registerDecoratedTools(this, this.webmcp);
  }

  @WebmcpTool({
    name: 'search-products',
    description: 'Search the product catalog',
    inputSchema: {
      query: { type: 'string', description: 'Search term' },
    },
  })
  async search(args: { query: string }) {
    const results = await this.api.search(args.query);
    return { content: [{ type: 'text', text: JSON.stringify(results) }] };
  }
}
```

### Register a Tool via Directive

```html
<button
  webmcpTool
  toolName="submit-form"
  toolDescription="Submit the checkout form"
  (toolInvoked)="onSubmit($event)"
>
  Checkout
</button>
```

### Check Support

```typescript
@Component({ ... })
export class MyComponent {
  webmcp = inject(WebmcpService);
  // webmcp.isSupported() is a Signal<boolean>
}
```

## API Reference

| Export | Type | Description |
|---|---|---|
| `WebmcpService` | Service | Core service for registering/unregistering tools |
| `WebmcpTool` | Decorator | Method decorator to mark a method as a WebMCP tool |
| `registerDecoratedTools` | Function | Registers all decorated methods of an instance |
| `WebmcpToolDirective` | Directive | Attribute directive for component-level tools |
| `WebmcpModule` | NgModule | Module with `forRoot()` for NgModule-based apps |
| `provideWebmcp` | Function | Provider function for standalone apps |
| `WEBMCP_CONFIG` | InjectionToken | Configuration token |

### WebMcpConfig

| Option | Type | Default | Description |
|---|---|---|---|
| `autoInit` | `boolean` | `true` | Auto-initialize on service creation |
| `logLevel` | `'debug' \| 'warn' \| 'none'` | `'warn'` | Console logging level |
| `fallbackBehavior` | `'silent' \| 'warn' \| 'throw'` | `'warn'` | Behavior when `navigator.modelContext` is unavailable |

## Development Polyfill

Since `navigator.modelContext` is only available in Chrome 146+ Canary with a flag, use the testing polyfill for development:

```typescript
import { installWebMcpPolyfill } from 'ng-webmcp/testing';
installWebMcpPolyfill();
```

Import this **before** bootstrapping Angular.

## Browser Support

| Browser | Support |
|---|---|
| Chrome 146+ (Canary) | ✅ Behind `chrome://flags/#web-mcp` |
| Other browsers | ❌ Use polyfill for development |

## Links

- [W3C WebMCP Spec](https://webmachinelearning.github.io/webmcp/)
- [GitHub Repo](https://github.com/webmachinelearning/webmcp)
- [Chrome Early Preview](https://developer.chrome.com/blog/webmcp-epp)

## License

MIT


