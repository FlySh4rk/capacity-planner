import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Skill } from '../../../core/models/skill.model';

interface DialogData {
  skill: Skill;
}

@Component({
  selector: 'app-skill-form-dialog',
  templateUrl: './skill-form-dialog.component.html',
  styleUrls: ['./skill-form-dialog.component.scss']
})
export class SkillFormDialogComponent implements OnInit {
  skillForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SkillFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.skillForm = this.formBuilder.group({
      name: [this.data.skill.name || '', Validators.required],
      category: [this.data.skill.category || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.skillForm.valid) {
      this.dialogRef.close(this.skillForm.value);
    }
  }
}
