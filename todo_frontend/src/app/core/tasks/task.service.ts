import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CreateTaskDto, Task, Paginated } from './task.types';

export interface TaskQuery {
  page?: number;
  page_size?: number;
  search?: string;
  estado?: number | null;
  persona?: number | null;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private baseUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  list(q: TaskQuery = {}): Observable<Task[] | Paginated<Task>> {
    const params: any = {};
    if (q.page) params['page'] = q.page;
    if (q.page_size) params['page_size'] = q.page_size;
    if (q.search) params['search'] = q.search;
    if (q.estado !== undefined && q.estado !== null) params['estado'] = q.estado;
    if (q.persona !== undefined && q.persona !== null) params['persona'] = q.persona;
    return this.http.get<Task[] | Paginated<Task>>(`${this.baseUrl}/tasks/`, { params });
  }

  create(dto: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks/`, dto);
  }

  patch(id: number, partial: Partial<CreateTaskDto>): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/tasks/${id}/`, partial);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}/`);
  }
}
