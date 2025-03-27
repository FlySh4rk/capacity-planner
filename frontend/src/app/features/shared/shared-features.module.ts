import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    ConfirmDialogComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    ConfirmDialogComponent
  ]
})
export class SharedFeaturesModule { }
