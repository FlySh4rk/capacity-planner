import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Developer, DeveloperWorkload } from '../models/developer.model';

@Injectable({
  providedIn: 'root'
})
export class DeveloperService {
  private path = '/developers';

  constructor(private apiService: ApiService) { }

  getDevelopers(): Observable<Developer[]> {
    return this.apiService.get<Developer[]>(this.path);
  }

  getDeveloper(id: number): Observable<Developer> {
    return this.apiService.get<Developer>(`${this.path}/${id}`);
  }

  createDeveloper(developer: Developer): Observable<Developer> {
    return this.apiService.post<Developer, Developer>(this.path, developer);
  }

  updateDeveloper(id: number, developer: Partial<Developer>): Observable<Developer> {
    return this.apiService.put<Developer, Partial<Developer>>(`${this.path}/${id}`, developer);
  }

  deleteDeveloper(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}/${id}`);
  }

  getDeveloperWorkload(): Observable<DeveloperWorkload[]> {
    return this.apiService.get<DeveloperWorkload[]>('/reports/developer-workload');
  }

  getDeveloperAvailability(startDate?: Date, endDate?: Date): Observable<any[]> {
    let params = new HttpParams();
    
    if (startDate) {
      params = params.set('start_date', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('end_date', endDate.toISOString());
    }
    
    return this.apiService.get<any[]>('/reports/developer-availability', params);
  }
}
