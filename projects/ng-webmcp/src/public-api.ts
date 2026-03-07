export { WebmcpService } from './lib/services/webmcp.service';
export { WebmcpTool, registerDecoratedTools, getWebmcpToolMeta } from './lib/decorators/webmcp-tool.decorator';
export { WebmcpToolDirective } from './lib/directives/webmcp-tool.directive';
export { WebmcpModule } from './lib/ng-webmcp.module';
export { provideWebmcp } from './lib/provide-webmcp';
export { WEBMCP_CONFIG } from './lib/tokens/webmcp-config.token';
export type {
  WebMcpToolSchema,
  WebMcpToolHandler,
  WebMcpToolResult,
  WebMcpConfig,
  JsonSchemaProperty,
  ModelContextApi,
} from './lib/types/webmcp.types';
