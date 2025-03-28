import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.production ? '' : '/api';

  constructor(private http: HttpClient) {
    console.log('API URL:', this.apiUrl);
  }

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    const url = `${this.apiUrl}${path}`;
    console.log('GET request to:', url);
    return this.http.get<T>(url, { params });
  }

  post<T, D>(path: string, data: D): Observable<T> {
    const url = `${this.apiUrl}${path}`;
    console.log('POST request to:', url, 'with data:', data);
    return this.http.post<T>(url, data);
  }

  put<T, D>(path: string, data: D): Observable<T> {
    const url = `${this.apiUrl}${path}`;
    console.log('PUT request to:', url, 'with data:', data);
    return this.http.put<T>(url, data);
  }

  delete<T>(path: string): Observable<T> {
    const url = `${this.apiUrl}${path}`;
    console.log('DELETE request to:', url);
    return this.http.delete<T>(url);
  }
}
