import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private path = '/projects';

  constructor(private apiService: ApiService) { }

  getProjects(): Observable<Project[]> {
    return this.apiService.get<Project[]>(this.path);
  }

  getProject(id: number): Observable<Project> {
    return this.apiService.get<Project>(`${this.path}/${id}`);
  }

  createProject(project: Project): Observable<Project> {
    // Convert date strings to ISO format
    const formattedProject = {
      ...project,
      start_date: new Date(project.start_date).toISOString(),
      end_date: project.end_date ? new Date(project.end_date).toISOString() : undefined
    };
    
    return this.apiService.post<Project, any>(this.path, formattedProject);
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    // Format dates if present
    const formattedProject = { ...project };
    
    if (formattedProject.start_date) {
      formattedProject.start_date = new Date(formattedProject.start_date).toISOString();
    }
    
    if (formattedProject.end_date) {
      formattedProject.end_date = new Date(formattedProject.end_date).toISOString();
    }
    
    return this.apiService.put<Project, Partial<Project>>(`${this.path}/${id}`, formattedProject);
  }

  deleteProject(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}/${id}`);
  }
}
