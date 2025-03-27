import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface AlertSettingsData {
  daysAhead: number;
}

@Component({
  selector: 'app-alert-settings-dialog',
  templateUrl: './alert-settings-dialog.component.html',
  styleUrls: ['./alert-settings-dialog.component.scss']
})
export class AlertSettingsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: AlertSettingsData) {}
}
