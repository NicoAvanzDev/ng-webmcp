import { Component, inject, computed } from '@angular/core';
import { WebmcpService, WebmcpToolDirective } from 'ng-webmcp';
import { ProductService } from './product.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WebmcpToolDirective, JsonPipe],
  template: `
    <h1>ng-webmcp Demo</h1>

    <section>
      <h2>WebMCP Status</h2>
      <p>Supported: <strong>{{ webmcp.isSupported() ? '✅ Yes' : '❌ No' }}</strong></p>
    </section>

    <section>
      <h2>Registered Tools</h2>
      <ul>
        @for (tool of tools(); track tool.name) {
          <li>
            <strong>{{ tool.name }}</strong> — {{ tool.description }}
            <pre>{{ tool.inputSchema | json }}</pre>
          </li>
        }
      </ul>
    </section>

    <section>
      <h2>Directive-based Tool</h2>
      <button
        webmcpTool
        toolName="submit-form"
        toolDescription="Submit the checkout form"
        [inputSchema]="{ type: 'object', properties: { note: { type: 'string', description: 'Optional note' } } }"
        (toolInvoked)="onFormSubmit($event)"
      >
        Checkout
      </button>
      @if (lastInvocation) {
        <p>Last invocation args: {{ lastInvocation | json }}</p>
      }
    </section>
  `,
})
export class App {
  readonly webmcp = inject(WebmcpService);
  private readonly _products = inject(ProductService); // triggers decorator registration

  tools = computed(() => Array.from(this.webmcp.getRegisteredTools().values()));
  lastInvocation: any = null;

  onFormSubmit(args: any): void {
    this.lastInvocation = args;
    console.log('Form submitted via WebMCP tool:', args);
  }
}


