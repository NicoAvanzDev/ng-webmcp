export interface JsonSchemaProperty {
  type: string;
  description?: string;
  default?: unknown;
  enum?: unknown[];
  items?: JsonSchemaProperty;
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
  anyOf?: Array<{ const: unknown; title?: string }>;
}

export interface WebMcpInputSchema {
  type: 'object';
  properties: Record<string, JsonSchemaProperty>;
  required?: string[];
}

export interface WebMcpToolAnnotations {
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
  untrustedContentHint?: boolean;
  [key: string]: boolean | undefined;
}

export interface WebMcpToolDefinition<T = Record<string, unknown>> {
  name: string;
  description: string;
  inputSchema: WebMcpInputSchema;
  annotations?: WebMcpToolAnnotations;
  execute: (args: T) => WebMcpToolResult | Promise<WebMcpToolResult>;
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
  registerTool(tool: WebMcpToolDefinition, options?: { signal?: AbortSignal }): void;
  /** Polyfill inspection helper */
  _tools?: Map<string, WebMcpToolDefinition>;
}

/**
 * Schema-only definition used by the decorator and directive.
 * The `execute` callback is provided separately.
 */
export interface WebMcpToolSchema {
  name: string;
  description: string;
  inputSchema: WebMcpInputSchema;
  annotations?: WebMcpToolAnnotations;
}
