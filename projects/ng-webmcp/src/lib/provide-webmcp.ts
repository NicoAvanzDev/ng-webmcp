import { Provider } from '@angular/core';
import { WEBMCP_CONFIG, DEFAULT_WEBMCP_CONFIG } from './tokens/webmcp-config.token';
import type { WebMcpConfig } from './types/webmcp.types';

/**
 * Provides ng-webmcp configuration for standalone applications.
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideWebmcp({ fallbackBehavior: 'warn' })]
 * });
 * ```
 */
export function provideWebmcp(config?: Partial<WebMcpConfig>): Provider[] {
  return [
    {
      provide: WEBMCP_CONFIG,
      useValue: { ...DEFAULT_WEBMCP_CONFIG, ...config },
    },
  ];
}
