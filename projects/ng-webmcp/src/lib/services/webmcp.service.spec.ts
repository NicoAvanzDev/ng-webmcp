import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { WebmcpService } from './webmcp.service';
import { WEBMCP_CONFIG } from '../tokens/webmcp-config.token';
import type { WebMcpToolSchema } from '../types/webmcp.types';
import { describe, it, expect, afterEach, vi } from 'vitest';

function installPolyfill(): Map<string, any> {
  const tools = new Map<string, any>();
  Object.defineProperty(navigator, 'modelContext', {
    value: {
      registerTool: (schema: any, handler: any) => tools.set(schema.name, { schema, handler }),
      unregisterTool: (name: string) => tools.delete(name),
      _tools: tools,
    },
    configurable: true,
    writable: true,
  });
  return tools;
}

function clearPolyfill(): void {
  delete (navigator as any).modelContext;
}

const testSchema: WebMcpToolSchema = {
  name: 'test-tool',
  description: 'A test tool',
  inputSchema: { query: { type: 'string', description: 'test' } },
};

describe('WebmcpService', () => {
  afterEach(() => {
    clearPolyfill();
    TestBed.resetTestingModule();
  });

  function createService(config?: any): WebmcpService {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        ...(config ? [{ provide: WEBMCP_CONFIG, useValue: config }] : []),
      ],
    });
    return TestBed.inject(WebmcpService);
  }

  it('should detect support when polyfill is installed', () => {
    installPolyfill();
    const service = createService();
    expect(service.isSupported()).toBe(true);
  });

  it('should detect no support when polyfill is absent', () => {
    const service = createService();
    expect(service.isSupported()).toBe(false);
  });

  it('should register and unregister a tool', () => {
    const tools = installPolyfill();
    const service = createService();
    const handler = vi.fn().mockReturnValue({ content: [{ type: 'text', text: 'ok' }] });

    service.registerTool(testSchema, handler);
    expect(service.getRegisteredTools().has('test-tool')).toBe(true);
    expect(tools.has('test-tool')).toBe(true);

    service.unregisterTool('test-tool');
    expect(service.getRegisteredTools().has('test-tool')).toBe(false);
    expect(tools.has('test-tool')).toBe(false);
  });

  it('should warn when registering without support', () => {
    const service = createService();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    service.registerTool(testSchema, () => ({ content: [{ type: 'text', text: '' }] }));
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('should throw when fallbackBehavior is throw', () => {
    const service = createService({ fallbackBehavior: 'throw', logLevel: 'none' });
    expect(() =>
      service.registerTool(testSchema, () => ({ content: [{ type: 'text', text: '' }] }))
    ).toThrowError(/not available/);
  });

  it('should be silent when fallbackBehavior is silent', () => {
    const service = createService({ fallbackBehavior: 'silent', logLevel: 'none' });
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    service.registerTool(testSchema, () => ({ content: [{ type: 'text', text: '' }] }));
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('should clean up all tools on destroy', () => {
    const tools = installPolyfill();
    const service = createService();
    service.registerTool(testSchema, () => ({ content: [{ type: 'text', text: '' }] }));
    service.registerTool(
      { ...testSchema, name: 'tool-2' },
      () => ({ content: [{ type: 'text', text: '' }] })
    );
    expect(tools.size).toBe(2);

    service.ngOnDestroy();
    expect(tools.size).toBe(0);
    expect(service.getRegisteredTools().size).toBe(0);
  });
});
