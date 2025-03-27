import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() message: string | null = null;
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.message = null;
    this.closed.emit();
  }
}
