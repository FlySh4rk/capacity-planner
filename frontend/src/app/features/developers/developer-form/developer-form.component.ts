import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeveloperService } from '../../../core/services/developer.service';
import { SkillService } from '../../../core/services/skill.service';
import { Developer } from '../../../core/models/developer.model';
import { Skill } from '../../../core/models/skill.model';

@Component({
  selector: 'app-developer-form',
  templateUrl: './developer-form.component.html',
  styleUrls: ['./developer-form.component.scss']
})
export class DeveloperFormComponent implements OnInit {
  developerForm!: FormGroup;
  skills: Skill[] = [];
  isEditMode = false;
  developerId?: number;
  isLoading = false;
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private developerService: DeveloperService,
    private skillService: SkillService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSkills();
    
    // Check if we are in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.developerId = +params['id'];
        this.loadDeveloper(this.developerId);
      }
    });
  }

  initForm(): void {
    this.developerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      skill_ids: [[]]
    });
  }

  loadSkills(): void {
    this.skillService.getSkills().subscribe(
      (skills) => {
        this.skills = skills;
      },
      (error) => {
        this.snackBar.open('Error loading skills', 'Close', { duration: 3000 });
        console.error('Error loading skills:', error);
      }
    );
  }

  loadDeveloper(id: number): void {
    this.isLoading = true;
    this.developerService.getDeveloper(id).subscribe(
      (developer) => {
        // Extract skill IDs from the developer skills array
        const skillIds = developer.skills?.map(skill => skill.id) || [];
        
        // Patch form values
        this.developerForm.patchValue({
          name: developer.name,
          email: developer.email,
          role: developer.role,
          skill_ids: skillIds
        });
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open('Error loading developer', 'Close', { duration: 3000 });
        console.error('Error loading developer:', error);
        this.router.navigate(['/developers']);
      }
    );
  }

  submitForm(): void {
    if (this.developerForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const developerData: Developer = this.developerForm.value;

    if (this.isEditMode && this.developerId) {
      // Update existing developer
      this.developerService.updateDeveloper(this.developerId, developerData).subscribe(
        () => {
          this.isSubmitting = false;
          this.snackBar.open('Developer updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/developers']);
        },
        (error) => {
          this.isSubmitting = false;
          this.snackBar.open('Error updating developer', 'Close', { duration: 3000 });
          console.error('Error updating developer:', error);
        }
      );
    } else {
      // Create new developer
      this.developerService.createDeveloper(developerData).subscribe(
        () => {
          this.isSubmitting = false;
          this.snackBar.open('Developer created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/developers']);
        },
        (error) => {
          this.isSubmitting = false;
          this.snackBar.open('Error creating developer', 'Close', { duration: 3000 });
          console.error('Error creating developer:', error);
        }
      );
    }
  }

  resetForm(): void {
    if (this.isEditMode && this.developerId) {
      this.loadDeveloper(this.developerId);
    } else {
      this.developerForm.reset();
    }
  }

  goBack(): void {
    this.router.navigate(['/developers']);
  }
}
