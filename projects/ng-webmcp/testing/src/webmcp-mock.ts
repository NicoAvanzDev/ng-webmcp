/**
 * Installs a polyfill for `navigator.modelContext` for development and testing.
 * Since WebMCP is only available in Chrome Canary behind a flag, this enables
 * local development and unit testing.
 */
export function installWebMcpPolyfill(): void {
  if (typeof navigator !== 'undefined' && !(navigator as any).modelContext) {
    const tools = new Map<string, { schema: any; handler: any }>();
    Object.defineProperty(navigator, 'modelContext', {
      value: {
        registerTool: (schema: any, handler: any) =>
          tools.set(schema.name, { schema, handler }),
        unregisterTool: (name: string) => tools.delete(name),
        _tools: tools,
      },
      configurable: true,
    });
  }
}
