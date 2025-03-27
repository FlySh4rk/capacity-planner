import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertSettingsDialogComponent } from './alert-settings-dialog/alert-settings-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  alertDaysAhead = 14; // Default value

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Get saved alert settings from localStorage if available
    const savedDays = localStorage.getItem('alertDaysAhead');
    if (savedDays) {
      this.alertDaysAhead = parseInt(savedDays, 10);
    }
  }

  openAlertSettings(): void {
    const dialogRef = this.dialog.open(AlertSettingsDialogComponent, {
      width: '350px',
      data: { daysAhead: this.alertDaysAhead }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.alertDaysAhead = result.daysAhead;
        localStorage.setItem('alertDaysAhead', result.daysAhead.toString());
      }
    });
  }
}
