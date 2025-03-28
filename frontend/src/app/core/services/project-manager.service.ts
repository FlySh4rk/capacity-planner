import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ProjectManager } from '../models/project-manager.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagerService {
  private path = '/project-managers';

  constructor(private apiService: ApiService) { }

  getProjectManagers(): Observable<ProjectManager[]> {
    return this.apiService.get<ProjectManager[]>(this.path);
  }

  getProjectManager(id: number): Observable<ProjectManager> {
    return this.apiService.get<ProjectManager>(`${this.path}/${id}`);
  }

  createProjectManager(projectManager: ProjectManager): Observable<ProjectManager> {
    return this.apiService.post<ProjectManager, ProjectManager>(this.path, projectManager);
  }

  updateProjectManager(id: number, projectManager: Partial<ProjectManager>): Observable<ProjectManager> {
    return this.apiService.put<ProjectManager, Partial<ProjectManager>>(`${this.path}/${id}`, projectManager);
  }

  deleteProjectManager(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}/${id}`);
  }
}
