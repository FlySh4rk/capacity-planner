import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SharedFeaturesModule } from '../shared/shared-features.module';

import { AllocationListComponent } from './allocation-list/allocation-list.component';
import { AllocationFormComponent } from './allocation-form/allocation-form.component';

const routes: Routes = [
  { path: '', component: AllocationListComponent },
  { path: 'new', component: AllocationFormComponent },
  { path: ':id/edit', component: AllocationFormComponent }
];

@NgModule({
  declarations: [
    AllocationListComponent,
    AllocationFormComponent
  ],
  imports: [
    SharedModule,
    SharedFeaturesModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AllocationsModule { }
