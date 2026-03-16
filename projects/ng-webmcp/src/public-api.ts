export { WebmcpService, type WebMcpToolHandler } from './lib/services/webmcp.service';
export {
  WebmcpTool,
  registerDecoratedTools,
  getWebmcpToolMeta,
} from './lib/decorators/webmcp-tool.decorator';
export { WebmcpToolRegistrar } from './lib/decorators/webmcp-tool-registrar';
export { WebmcpToolDirective } from './lib/directives/webmcp-tool.directive';
export { WebmcpModule } from './lib/ng-webmcp.module';
export { provideWebmcp } from './lib/provide-webmcp';
export { WEBMCP_CONFIG } from './lib/tokens/webmcp-config.token';
export type {
  WebMcpToolSchema,
  WebMcpToolDefinition,
  WebMcpToolResult,
  WebMcpConfig,
  WebMcpInputSchema,
  JsonSchemaProperty,
  ModelContextApi,
} from './lib/types/webmcp.types';
