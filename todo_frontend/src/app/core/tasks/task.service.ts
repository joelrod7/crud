import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CreateTaskDto, Task, Paginated } from './task.types';

export interface TaskQuery {
  page?: number;
  page_size?: number;
  search?: string;
  estado?: number | null;
  asignado?: number | null;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private baseUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  list(q: TaskQuery = {}): Observable<Task[] | Paginated<Task>> {
    let params = new HttpParams();
    if (q.page) params = params.set('page', String(q.page));
    if (q.page_size) params = params.set('page_size', String(q.page_size));
    if (q.search && q.search.trim()) params = params.set('search', q.search.trim());
    if (q.estado !== null && q.estado !== undefined) params = params.set('estado', String(q.estado));
    if (q.asignado !== null && q.asignado !== undefined) params = params.set('asignado', String(q.asignado));
    return this.http.get<Task[] | Paginated<Task>>(`${this.baseUrl}/tasks/`, { params });
  }

  create(dto: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks/`, dto);
  }

  patch(
    id: number,
    partial: Partial<CreateTaskDto> & { asignado?: number | null; activo?: number }
  ) {
    return this.http.patch<Task>(`${this.baseUrl}/tasks/${id}/`, partial);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}/`);
  }
}
