import {
  Directive,
  EventEmitter,
  Input,
  Output,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { WebmcpService } from '../services/webmcp.service';
import type { WebMcpInputSchema } from '../types/webmcp.types';

@Directive({
  selector: '[webmcpTool]',
  standalone: true,
})
export class WebmcpToolDirective implements OnInit {
  private readonly webmcp = inject(WebmcpService);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) toolName!: string;
  @Input({ required: true }) toolDescription!: string;
  @Input() inputSchema: WebMcpInputSchema = { type: 'object', properties: {} };

  @Output() toolInvoked = new EventEmitter<any>();

  ngOnInit(): void {
    const schema = {
      name: this.toolName,
      description: this.toolDescription,
      inputSchema: this.inputSchema,
    };

    const controller = this.webmcp.registerTool(schema, (args) => {
      this.toolInvoked.emit(args);
      return { content: [{ type: 'text' as const, text: 'Tool invoked via directive' }] };
    });

    if (controller) {
      this.destroyRef.onDestroy(() => controller.abort());
    }
  }
}
