# ng-webmcp

Angular library for the [WebMCP (Web Model Context Protocol)](https://webmachinelearning.github.io/webmcp/) browser API. Expose your Angular application as an AI-agent-ready tool provider using idiomatic Angular patterns.

## Installation

```bash
npm install ng-webmcp
```

## Quick Start

### Standalone Application

```typescript
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

### Register a Tool via Decorator

```typescript
import { inject, Injectable } from '@angular/core';
import {
  WebmcpService,
  WebmcpTool,
  registerDecoratedTools,
} from 'ng-webmcp';

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

### Development Polyfill

```typescript
import { installWebMcpPolyfill } from 'ng-webmcp/testing';

installWebMcpPolyfill();
```

Import this before bootstrapping Angular.

## Publishing

The GitHub Actions release workflow publishes only when the pushed tag exactly matches the library version in `projects/ng-webmcp/package.json`.

Configure npm Trusted Publisher for this GitHub repository and workflow file before creating the tag. No `NPM_TOKEN` secret is required.

```bash
npm run build:lib
git tag v0.1.0
git push origin v0.1.0
```

## Links

- [W3C WebMCP Spec](https://webmachinelearning.github.io/webmcp/)
- [GitHub Repo](https://github.com/nicoavanzdev/ng-webmcp)
