/**
 * Installs a polyfill for `navigator.modelContext` for development and testing.
 * Matches the real Chrome WebMCP API where registerTool takes a single object
 * with an `execute` property, plus an optional `{ signal }` option for unregistration.
 */
export function installWebMcpPolyfill(): void {
  if (typeof navigator !== 'undefined' && !(navigator as any).modelContext) {
    const tools = new Map<string, any>();
    Object.defineProperty(navigator, 'modelContext', {
      value: {
        registerTool: (tool: any, options?: { signal?: AbortSignal }) => {
          tools.set(tool.name, tool);
          options?.signal?.addEventListener('abort', () => tools.delete(tool.name), { once: true });
        },
        _tools: tools,
      },
      configurable: true,
    });
  }
}
