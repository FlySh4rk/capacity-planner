import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { DeveloperListComponent } from './developer-list/developer-list.component';
import { DeveloperFormComponent } from './developer-form/developer-form.component';
import { DeveloperDetailComponent } from './developer-detail/developer-detail.component';

const routes: Routes = [
  { path: '', component: DeveloperListComponent },
  { path: 'new', component: DeveloperFormComponent },
  { path: ':id', component: DeveloperDetailComponent },
  { path: ':id/edit', component: DeveloperFormComponent }
];

@NgModule({
  declarations: [
    DeveloperListComponent,
    DeveloperFormComponent,
    DeveloperDetailComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DevelopersModule { }
