/**
 * Installs a polyfill for `navigator.modelContext` for development and testing.
 * Matches the real Chrome WebMCP API where registerTool takes a single object
 * with an `execute` property.
 */
export function installWebMcpPolyfill(): void {
  if (typeof navigator !== 'undefined' && !(navigator as any).modelContext) {
    const tools = new Map<string, any>();
    Object.defineProperty(navigator, 'modelContext', {
      value: {
        registerTool: (tool: any) => tools.set(tool.name, tool),
        unregisterTool: (name: string) => tools.delete(name),
        _tools: tools,
      },
      configurable: true,
    });
  }
}
