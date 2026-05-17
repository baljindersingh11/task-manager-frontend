import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Task {
  _id?: string;
  id?: string;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5000/api/tasks';

  getTasks() {

    return this.http.get<any>(this.apiUrl);

  }

  createTask(task: { title: string }) {

    return this.http.post<any>(this.apiUrl, task);

  }

  updateTask(id: string, task: Partial<Task>) {

    return this.http.put<any>(`${this.apiUrl}/${id}`, task);

  }

  deleteTask(id: string) {

    return this.http.delete(`${this.apiUrl}/${id}`);

  }

}
