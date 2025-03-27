import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Allocation, EndingAllocation } from '../models/allocation.model';

@Injectable({
  providedIn: 'root'
})
export class AllocationService {
  private path = '/allocations';

  constructor(private apiService: ApiService) { }

  getAllocations(developerId?: number, projectId?: number): Observable<Allocation[]> {
    let params = new HttpParams();
    
    if (developerId) {
      params = params.set('developer_id', developerId.toString());
    }
    
    if (projectId) {
      params = params.set('project_id', projectId.toString());
    }
    
    return this.apiService.get<Allocation[]>(this.path, params);
  }

  getAllocation(id: number): Observable<Allocation> {
    return this.apiService.get<Allocation>(`${this.path}/${id}`);
  }

  createAllocation(allocation: Allocation): Observable<Allocation> {
    // Format dates
    const formattedAllocation = {
      ...allocation,
      start_date: new Date(allocation.start_date).toISOString(),
      end_date: new Date(allocation.end_date).toISOString()
    };
    
    return this.apiService.post<Allocation, any>(this.path, formattedAllocation);
  }

  updateAllocation(id: number, allocation: Partial<Allocation>): Observable<Allocation> {
    // Format dates if present
    const formattedAllocation = { ...allocation };
    
    if (formattedAllocation.start_date) {
      formattedAllocation.start_date = new Date(formattedAllocation.start_date).toISOString();
    }
    
    if (formattedAllocation.end_date) {
      formattedAllocation.end_date = new Date(formattedAllocation.end_date).toISOString();
    }
    
    return this.apiService.put<Allocation, Partial<Allocation>>(`${this.path}/${id}`, formattedAllocation);
  }

  deleteAllocation(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}/${id}`);
  }

  getEndingAllocations(daysAhead: number = 14): Observable<EndingAllocation[]> {
    const params = new HttpParams().set('days_ahead', daysAhead.toString());
    return this.apiService.get<EndingAllocation[]>('/reports/ending-allocations', params);
  }
}
