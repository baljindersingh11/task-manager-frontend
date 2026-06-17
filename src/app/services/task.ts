import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Task {
  _id?: string;
  id?: string;
  title: string;
  completed: boolean;
  dueDate?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/tasks`;

  getTasks() {

    return this.http.get<any>(this.apiUrl);

  }

  createTask(task: { title: string; dueDate?: string }) {

    return this.http.post<any>(this.apiUrl, task);

  }

  updateTask(id: string, task: Partial<Task>) {

    return this.http.put<any>(`${this.apiUrl}/${id}`, task);

  }

  deleteTask(id: string) {

    return this.http.delete(`${this.apiUrl}/${id}`);

  }

}
