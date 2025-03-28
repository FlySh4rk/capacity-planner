import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectManager } from '../../../core/models/project-manager.model';

interface DialogData {
  projectManager: ProjectManager;
}

@Component({
  selector: 'app-project-manager-form-dialog',
  templateUrl: './project-manager-form-dialog.component.html',
  styleUrls: ['./project-manager-form-dialog.component.scss']
})
export class ProjectManagerFormDialogComponent implements OnInit {
  projectManagerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProjectManagerFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.projectManagerForm = this.formBuilder.group({
      name: [this.data.projectManager.name || '', Validators.required],
      email: [this.data.projectManager.email || '', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.projectManagerForm.valid) {
      this.dialogRef.close(this.projectManagerForm.value);
    }
  }
}
