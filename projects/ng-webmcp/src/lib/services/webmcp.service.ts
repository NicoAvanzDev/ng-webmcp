import {
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  DestroyRef,
  inject,
  signal,
  type Signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { WEBMCP_CONFIG } from '../tokens/webmcp-config.token';
import type {
  WebMcpToolSchema,
  WebMcpToolHandler,
  WebMcpConfig,
  ModelContextApi,
} from '../types/webmcp.types';

function getModelContext(): ModelContextApi | undefined {
  return (navigator as any).modelContext as ModelContextApi | undefined;
}

@Injectable({ providedIn: 'root' })
export class WebmcpService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly config: WebMcpConfig = inject(WEBMCP_CONFIG);
  private readonly destroyRef = inject(DestroyRef);
  private readonly registry = new Map<string, WebMcpToolSchema>();
  private readonly _isSupported = signal(false);

  /** Whether navigator.modelContext is available */
  readonly isSupported: Signal<boolean> = this._isSupported.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this._isSupported.set(!!getModelContext());
    }
    this.destroyRef.onDestroy(() => this.disposeAll());
  }

  registerTool<T = Record<string, unknown>>(
    schema: WebMcpToolSchema,
    handler: WebMcpToolHandler<T>,
  ): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const mc = getModelContext();
    if (!mc) {
      this.handleUnsupported(`Cannot register tool "${schema.name}": navigator.modelContext is not available`);
      return;
    }

    mc.registerTool(schema, handler as WebMcpToolHandler);
    this.registry.set(schema.name, schema);
    this.log('debug', `Registered tool: ${schema.name}`);
  }

  unregisterTool(name: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const mc = getModelContext();
    if (mc) {
      mc.unregisterTool(name);
    }
    this.registry.delete(name);
    this.log('debug', `Unregistered tool: ${name}`);
  }

  getRegisteredTools(): ReadonlyMap<string, WebMcpToolSchema> {
    return this.registry;
  }

  ngOnDestroy(): void {
    this.disposeAll();
  }

  private disposeAll(): void {
    for (const name of Array.from(this.registry.keys())) {
      this.unregisterTool(name);
    }
  }

  private handleUnsupported(message: string): void {
    switch (this.config.fallbackBehavior) {
      case 'throw':
        throw new Error(message);
      case 'warn':
        console.warn(`[ng-webmcp] ${message}`);
        break;
      case 'silent':
      default:
        break;
    }
  }

  private log(level: 'debug' | 'warn', message: string): void {
    if (this.config.logLevel === 'none') return;
    if (level === 'debug' && this.config.logLevel !== 'debug') return;
    if (level === 'debug') {
      console.debug(`[ng-webmcp] ${message}`);
    } else {
      console.warn(`[ng-webmcp] ${message}`);
    }
  }
}
