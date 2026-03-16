import type { WebMcpToolSchema } from '../types/webmcp.types';

/** Metadata stored per decorated method */
export interface WebmcpToolMeta {
  propertyKey: string;
  schema: WebMcpToolSchema;
}

/** Static registry: constructor → list of decorated methods */
const TOOL_REGISTRY = new Map<Function, WebmcpToolMeta[]>();

/**
 * Method decorator that marks a service method as a WebMCP tool.
 *
 * For automatic registration, extend `WebmcpToolRegistrar`:
 * ```ts
 * @Injectable({ providedIn: 'root' })
 * export class MyService extends WebmcpToolRegistrar {
 *   @WebmcpTool({ name: 'search', description: '...', inputSchema: { ... } })
 *   async search(args: { query: string }) { ... }
 * }
 * ```
 *
 * For manual registration, call `registerDecoratedTools(this, inject(WebmcpService))`
 * inside the constructor.
 */
export function WebmcpTool(schema: WebMcpToolSchema): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const ctor = target.constructor;
    const existing = TOOL_REGISTRY.get(ctor) ?? [];
    existing.push({ propertyKey: String(propertyKey), schema });
    TOOL_REGISTRY.set(ctor, existing);
  };
}

/**
 * Returns all @WebmcpTool metadata for a given class constructor.
 */
export function getWebmcpToolMeta(ctor: Function): WebmcpToolMeta[] {
  return TOOL_REGISTRY.get(ctor) ?? [];
}

/**
 * Registers all @WebmcpTool-decorated methods of an instance with the WebmcpService.
 * Call this in the constructor of the service that has decorated methods.
 *
 * ```ts
 * constructor() {
 *   registerDecoratedTools(this, inject(WebmcpService));
 * }
 * ```
 */
export function registerDecoratedTools(instance: any, service: any): void {
  const metas = getWebmcpToolMeta(instance.constructor);
  for (const meta of metas) {
    const handler = (instance[meta.propertyKey] as Function).bind(instance);
    service.registerTool(meta.schema, handler);
  }
}
