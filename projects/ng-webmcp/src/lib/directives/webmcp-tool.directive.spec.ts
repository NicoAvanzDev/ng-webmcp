import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebmcpToolDirective } from './webmcp-tool.directive';
import { describe, it, expect, afterEach, beforeEach } from 'vitest';

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

@Component({
  standalone: true,
  imports: [WebmcpToolDirective],
  template: `
    <button
      webmcpTool
      toolName="test-directive"
      toolDescription="A directive tool"
      (toolInvoked)="onInvoke($event)"
    >Click</button>
  `,
})
class TestHostComponent {
  lastArgs: any = null;
  onInvoke(args: any): void {
    this.lastArgs = args;
  }
}

describe('WebmcpToolDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let tools: Map<string, any>;

  beforeEach(() => {
    tools = installPolyfill();
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    clearPolyfill();
    TestBed.resetTestingModule();
  });

  it('should register tool on init', () => {
    expect(tools.has('test-directive')).toBe(true);
  });

  it('should unregister tool on destroy', () => {
    fixture.destroy();
    expect(tools.has('test-directive')).toBe(false);
  });

  it('should emit toolInvoked when handler is called', () => {
    const entry = tools.get('test-directive');
    entry.handler({ foo: 'bar' });
    expect(fixture.componentInstance.lastArgs).toEqual({ foo: 'bar' });
  });
});
