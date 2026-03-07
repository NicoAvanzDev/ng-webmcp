import { NgModule, ModuleWithProviders } from '@angular/core';
import { WebmcpToolDirective } from './directives/webmcp-tool.directive';
import { WEBMCP_CONFIG, DEFAULT_WEBMCP_CONFIG } from './tokens/webmcp-config.token';
import type { WebMcpConfig } from './types/webmcp.types';

@NgModule({
  imports: [WebmcpToolDirective],
  exports: [WebmcpToolDirective],
})
export class WebmcpModule {
  static forRoot(config?: Partial<WebMcpConfig>): ModuleWithProviders<WebmcpModule> {
    return {
      ngModule: WebmcpModule,
      providers: [
        {
          provide: WEBMCP_CONFIG,
          useValue: { ...DEFAULT_WEBMCP_CONFIG, ...config },
        },
      ],
    };
  }
}
