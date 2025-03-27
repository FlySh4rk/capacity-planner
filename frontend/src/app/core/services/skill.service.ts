import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Skill, TechnologyUsage } from '../models/skill.model';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private path = '/skills';

  constructor(private apiService: ApiService) { }

  getSkills(): Observable<Skill[]> {
    console.log('Getting skills from:', this.path);
    return this.apiService.get<Skill[]>(this.path);
  }

  getSkill(id: number): Observable<Skill> {
    console.log(`Getting skill ${id} from:`, `${this.path}/${id}`);
    return this.apiService.get<Skill>(`${this.path}/${id}`);
  }

  createSkill(skill: Skill): Observable<Skill> {
    console.log('Creating skill at:', this.path, 'with data:', skill);
    return this.apiService.post<Skill, Skill>(this.path, skill);
  }

  updateSkill(id: number, skill: Partial<Skill>): Observable<Skill> {
    console.log(`Updating skill ${id} at:`, `${this.path}/${id}`, 'with data:', skill);
    return this.apiService.put<Skill, Partial<Skill>>(`${this.path}/${id}`, skill);
  }

  deleteSkill(id: number): Observable<void> {
    console.log(`Deleting skill ${id} at:`, `${this.path}/${id}`);
    return this.apiService.delete<void>(`${this.path}/${id}`);
  }

  getTechnologyUsage(): Observable<TechnologyUsage[]> {
    console.log('Getting technology usage from:', '/reports/technology-usage');
    return this.apiService.get<TechnologyUsage[]>('/reports/technology-usage');
  }
}
