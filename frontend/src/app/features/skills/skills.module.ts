import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { SkillListComponent } from './skill-list/skill-list.component';
import { SkillFormDialogComponent } from './skill-form-dialog/skill-form-dialog.component';

const routes: Routes = [
  { path: '', component: SkillListComponent }
];

@NgModule({
  declarations: [
    SkillListComponent,
    SkillFormDialogComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SkillsModule { }
