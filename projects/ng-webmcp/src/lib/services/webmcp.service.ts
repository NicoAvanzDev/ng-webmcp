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
  WebMcpToolDefinition,
  WebMcpConfig,
  ModelContextApi,
  WebMcpToolResult,
} from '../types/webmcp.types';

function getModelContext(): ModelContextApi | undefined {
  return (navigator as any).modelContext as ModelContextApi | undefined;
}

export type WebMcpToolHandler<T = Record<string, unknown>> =
  (args: T) => WebMcpToolResult | Promise<WebMcpToolResult>;

@Injectable({ providedIn: 'root' })
export class WebmcpService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly config: WebMcpConfig = inject(WEBMCP_CONFIG);
  private readonly destroyRef = inject(DestroyRef);
  private readonly registry = new Map<string, WebMcpToolSchema>();
  private readonly controllers = new Map<string, AbortController>();
  private readonly _isSupported = signal(false);

  /** Whether navigator.modelContext is available */
  readonly isSupported: Signal<boolean> = this._isSupported.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this._isSupported.set(!!getModelContext());
    }
    this.destroyRef.onDestroy(() => this.disposeAll());
  }

  /**
   * Register a tool with navigator.modelContext.
   * Returns an AbortController whose signal is passed to the native API.
   * Abort the controller to unregister the tool.
   */
  registerTool<T = Record<string, unknown>>(
    schema: WebMcpToolSchema,
    handler: WebMcpToolHandler<T>,
  ): AbortController | undefined {
    if (!isPlatformBrowser(this.platformId)) return undefined;

    const mc = getModelContext();
    if (!mc) {
      this.handleUnsupported(`Cannot register tool "${schema.name}": navigator.modelContext is not available`);
      return undefined;
    }

    const controller = new AbortController();
    const toolDef: WebMcpToolDefinition = {
      ...schema,
      execute: handler as WebMcpToolHandler,
    };

    mc.registerTool(toolDef, { signal: controller.signal });
    this.registry.set(schema.name, schema);
    this.controllers.set(schema.name, controller);
    this.log('debug', `Registered tool: ${schema.name}`);

    controller.signal.addEventListener('abort', () => {
      this.registry.delete(schema.name);
      this.controllers.delete(schema.name);
      this.log('debug', `Unregistered tool: ${schema.name}`);
    }, { once: true });

    return controller;
  }

  getRegisteredTools(): ReadonlyMap<string, WebMcpToolSchema> {
    return this.registry;
  }

  ngOnDestroy(): void {
    this.disposeAll();
  }

  private disposeAll(): void {
    for (const controller of Array.from(this.controllers.values())) {
      controller.abort();
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
