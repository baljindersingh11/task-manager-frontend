import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { Task, TaskService } from '../../services/task';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  tasks: Task[] = [];
  newTaskTitle = '';
  message = '';
  errorMessage = '';

  constructor(
    private taskService: TaskService,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {

    this.getTasks();

  }

  getTasks() {

    this.taskService.getTasks().subscribe({
      next: (response) => {
        this.tasks = this.getTaskList(response);
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Could not load tasks';
      }
    });

  }

  createTask() {

    if (!this.newTaskTitle.trim()) {
      return;
    }

    const task = {
      title: this.newTaskTitle
    };

    this.taskService.createTask(task).subscribe({
      next: () => {
        this.getTasks();
        this.newTaskTitle = '';
        this.message = 'Task created';
        this.errorMessage = '';
      },
      error: (error) => {
        this.message = '';
        this.errorMessage = error.error?.message || 'Could not create task';
      }
    });

  }

  toggleTask(task: Task) {

    const taskId = this.getTaskId(task);

    if (!taskId) {
      this.errorMessage = 'Task id is missing';
      return;
    }

    const updatedTask = {
      completed: !task.completed
    };

    this.taskService.updateTask(taskId, updatedTask).subscribe({
      next: (response) => {
        const savedTask = response.task || response;
        const completed = savedTask.completed ?? updatedTask.completed;

        this.tasks = this.tasks.map((currentTask) => {
          if (this.getTaskId(currentTask) === taskId) {
            return {
              ...currentTask,
              completed
            };
          }

          return currentTask;
        });

        this.message = 'Task updated';
        this.errorMessage = '';
      },
      error: (error) => {
        this.message = '';
        this.errorMessage = error.error?.message || 'Could not update task';
      }
    });

  }

  deleteTask(task: Task) {

    const taskId = this.getTaskId(task);

    if (!taskId) {
      this.errorMessage = 'Task id is missing';
      return;
    }

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((currentTask) => this.getTaskId(currentTask) !== taskId);

        this.message = 'Task deleted';
        this.errorMessage = '';
      },
      error: (error) => {
        this.message = '';
        this.errorMessage = error.error?.message || 'Could not delete task';
      }
    });

  }

  getTaskList(response: any): Task[] {

    if (Array.isArray(response)) {
      return response;
    }

    return response.tasks || [];

  }

  getTaskId(task: Task) {

    return task._id || task.id || '';

  }

  logout() {

    this.auth.logout();
    this.router.navigate(['/login']);

  }

}
