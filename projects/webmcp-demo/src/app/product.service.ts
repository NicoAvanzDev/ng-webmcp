import { Injectable } from '@angular/core';
import { WebmcpTool, WebmcpToolRegistrar } from 'ng-webmcp';
import type { WebMcpToolResult } from 'ng-webmcp';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Angular Handbook', price: 39.99 },
  { id: 2, name: 'TypeScript Deep Dive', price: 29.99 },
  { id: 3, name: 'RxJS in Action', price: 34.99 },
  { id: 4, name: 'NgRx Patterns', price: 24.99 },
];

@Injectable({ providedIn: 'root' })
export class ProductService extends WebmcpToolRegistrar {
  @WebmcpTool({
    name: 'search-products',
    description: 'Search the product catalog by keyword',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The search term' },
        limit: { type: 'number', description: 'Max results' },
      },
      required: ['query'],
    },
  })
  async searchProducts(args: { query: string; limit?: number }): Promise<WebMcpToolResult> {
    const q = args.query.toLowerCase();
    const results = MOCK_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)).slice(
      0,
      args.limit ?? 10,
    );
    return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
  }
}


