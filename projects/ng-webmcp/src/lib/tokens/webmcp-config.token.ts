import { InjectionToken } from '@angular/core';
import { WebMcpConfig } from '../types/webmcp.types';

export const DEFAULT_WEBMCP_CONFIG: WebMcpConfig = {
  autoInit: true,
  logLevel: 'warn',
  fallbackBehavior: 'warn',
};

export const WEBMCP_CONFIG = new InjectionToken<WebMcpConfig>('WEBMCP_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_WEBMCP_CONFIG,
});
