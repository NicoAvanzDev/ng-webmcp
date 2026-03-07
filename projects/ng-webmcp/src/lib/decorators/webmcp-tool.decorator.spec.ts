import { WebmcpTool, getWebmcpToolMeta, registerDecoratedTools } from './webmcp-tool.decorator';
import type { WebMcpToolResult } from '../types/webmcp.types';
import { describe, it, expect, vi } from 'vitest';

describe('WebmcpTool decorator', () => {
  it('should store metadata on the class', () => {
    class TestService {
      @WebmcpTool({
        name: 'test',
        description: 'A test',
        inputSchema: { q: { type: 'string' } },
      })
      doStuff(_args: any): WebMcpToolResult {
        return { content: [{ type: 'text', text: 'done' }] };
      }
    }

    const metas = getWebmcpToolMeta(TestService);
    expect(metas.length).toBe(1);
    expect(metas[0].schema.name).toBe('test');
    expect(metas[0].propertyKey).toBe('doStuff');
  });

  it('should register decorated methods with a mock service', () => {
    class TestService2 {
      @WebmcpTool({
        name: 'search',
        description: 'Search',
        inputSchema: {},
      })
      search(_args: any): WebMcpToolResult {
        return { content: [{ type: 'text', text: 'results' }] };
      }
    }

    const mockService = { registerTool: vi.fn() };
    const instance = new TestService2();
    registerDecoratedTools(instance, mockService);

    expect(mockService.registerTool).toHaveBeenCalledTimes(1);
    expect(mockService.registerTool.mock.calls[0][0].name).toBe('search');
  });
});
