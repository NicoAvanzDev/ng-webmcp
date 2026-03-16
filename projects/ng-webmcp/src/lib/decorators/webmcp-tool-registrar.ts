import { inject } from '@angular/core';
import { WebmcpService } from '../services/webmcp.service';
import { registerDecoratedTools } from './webmcp-tool.decorator';

/**
 * Base class that automatically registers all `@WebmcpTool`-decorated methods
 * of the subclass with `WebmcpService` at construction time.
 *
 * Extend this class instead of calling `registerDecoratedTools()` manually.
 *
 * ```ts
 * @Injectable({ providedIn: 'root' })
 * export class ProductService extends WebmcpToolRegistrar {
 *   @WebmcpTool({ name: 'search-products', description: '...', inputSchema: { ... } })
 *   async searchProducts(args: { query: string }): Promise<WebMcpToolResult> {
 *     // ...
 *   }
 * }
 * ```
 */
export abstract class WebmcpToolRegistrar {
  constructor() {
    const service = inject(WebmcpService);
    registerDecoratedTools(this, service);
  }
}
