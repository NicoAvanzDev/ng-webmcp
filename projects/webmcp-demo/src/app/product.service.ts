import { Injectable, inject } from '@angular/core';
import { WebmcpService, WebmcpTool, registerDecoratedTools } from 'ng-webmcp';
import type { WebMcpToolResult } from 'ng-webmcp';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Angular Handbook', price: 39.99 },
  { id: 2, name: 'TypeScript Deep Dive', price: 29.99 },
  { id: 3, name: 'RxJS in Action', price: 34.99 },
  { id: 4, name: 'NgRx Patterns', price: 24.99 },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly webmcp = inject(WebmcpService);

  constructor() {
    registerDecoratedTools(this, this.webmcp);
  }

  @WebmcpTool({
    name: 'search-products',
    description: 'Search the product catalog by keyword',
    inputSchema: {
      query: { type: 'string', description: 'The search term' },
      limit: { type: 'number', description: 'Max results', default: 10 },
    },
  })
  async searchProducts(args: { query: string; limit?: number }): Promise<WebMcpToolResult> {
    const q = args.query.toLowerCase();
    const results = MOCK_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)).slice(0, args.limit ?? 10);
    return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
  }
}
