import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { ProjectManagerListComponent } from './project-manager-list/project-manager-list.component';
import { ProjectManagerFormDialogComponent } from './project-manager-form-dialog/project-manager-form-dialog.component';

const routes: Routes = [
  { path: '', component: ProjectManagerListComponent }
];

@NgModule({
  declarations: [
    ProjectManagerListComponent,
    ProjectManagerFormDialogComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectManagersModule { }
