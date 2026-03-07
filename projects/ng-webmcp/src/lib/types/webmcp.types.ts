export interface JsonSchemaProperty {
  type: string;
  description?: string;
  default?: unknown;
  enum?: unknown[];
  items?: JsonSchemaProperty;
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
}

export interface WebMcpToolSchema {
  name: string;
  description: string;
  inputSchema: Record<string, JsonSchemaProperty>;
}

export interface WebMcpToolHandler<T = Record<string, unknown>> {
  (args: T): WebMcpToolResult | Promise<WebMcpToolResult>;
}

export interface WebMcpToolResult {
  content: Array<
    | { type: 'text'; text: string }
    | { type: 'image'; data: string; mimeType: string }
  >;
  isError?: boolean;
}

export interface WebMcpConfig {
  /** Automatically initialize on service creation. Default: true */
  autoInit?: boolean;
  /** Logging level. Default: 'warn' */
  logLevel?: 'debug' | 'warn' | 'none';
  /** Behavior when navigator.modelContext is not available. Default: 'warn' */
  fallbackBehavior?: 'silent' | 'warn' | 'throw';
}

/** Shape of navigator.modelContext when available */
export interface ModelContextApi {
  registerTool(schema: WebMcpToolSchema, handler: WebMcpToolHandler): void;
  unregisterTool(name: string): void;
  /** Polyfill inspection helper */
  _tools?: Map<string, { schema: WebMcpToolSchema; handler: WebMcpToolHandler }>;
}


