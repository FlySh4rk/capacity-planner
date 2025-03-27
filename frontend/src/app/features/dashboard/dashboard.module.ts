import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardComponent } from './dashboard.component';
import { WorkloadChartComponent } from './workload-chart/workload-chart.component';
import { TechnologyChartComponent } from './technology-chart/technology-chart.component';
import { AllocationAlertsComponent } from './allocation-alerts/allocation-alerts.component';
import { DeveloperAvailabilityComponent } from './developer-availability/developer-availability.component';
import { AlertSettingsDialogComponent } from './alert-settings-dialog/alert-settings-dialog.component';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [
    DashboardComponent,
    WorkloadChartComponent,
    TechnologyChartComponent,
    AllocationAlertsComponent,
    DeveloperAvailabilityComponent,
    AlertSettingsDialogComponent
  ],
  imports: [
    SharedModule,
    NgxChartsModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }
