import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { Auth } from '../../services/auth';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  tasks: any[] = [];
  newTaskTitle = '';
  newTaskDueDate = '';
  message = '';
  errorMessage = '';
  titleError = '';
  isLoadingTasks = false;
  isCreatingTask = false;
  updatingTaskId = '';
  deletingTaskId = '';

  constructor(
    private taskService: TaskService,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {

    this.getTasks();

  }

  getTasks() {

    this.isLoadingTasks = true;
    this.errorMessage = '';

    this.taskService.getTasks().pipe(
      timeout(10000),
      finalize(() => {
        this.isLoadingTasks = false;
      })
    ).subscribe({
      next: (response) => {
        this.tasks = this.getTaskList(response);
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Could not load tasks. Please check that the backend is running.';
      }
    });

  }

  createTask() {

    this.titleError = '';

    if (!this.newTaskTitle.trim()) {
      this.message = '';
      this.titleError = 'Task title is required';
      this.errorMessage = 'Please enter a task title';
      return;
    }

    this.isCreatingTask = true;
    this.message = '';
    this.errorMessage = '';

    const task = {
      title: this.newTaskTitle.trim(),
      dueDate: this.newTaskDueDate || undefined
    };

    this.taskService.createTask(task).subscribe({
      next: () => {
        this.isCreatingTask = false;
        this.getTasks();
        this.newTaskTitle = '';
        this.newTaskDueDate = '';
        this.titleError = '';
        this.message = 'Task created';
        this.errorMessage = '';
      },
      error: (error) => {
        this.isCreatingTask = false;
        this.message = '';
        this.errorMessage = error.error?.message || 'Could not create task';
      }
    });

  }

  toggleTask(task: any) {

    const taskId = this.getTaskId(task);

    if (!taskId) {
      this.message = '';
      this.errorMessage = 'Task id is missing';
      return;
    }

    this.updatingTaskId = taskId;
    this.message = '';
    this.errorMessage = '';

    const updatedTask = {
      completed: !task.completed
    };

    this.taskService.updateTask(taskId, updatedTask).subscribe({
      next: (response) => {
        this.updatingTaskId = '';
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
        this.updatingTaskId = '';
        this.message = '';
        this.errorMessage = error.error?.message || 'Could not update task';
      }
    });

  }

  deleteTask(task: any) {

    const taskId = this.getTaskId(task);

    if (!taskId) {
      this.message = '';
      this.errorMessage = 'Task id is missing';
      return;
    }

    const shouldDelete = confirm('Delete this task?');

    if (!shouldDelete) {
      return;
    }

    this.deletingTaskId = taskId;
    this.message = '';
    this.errorMessage = '';

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.deletingTaskId = '';
        this.tasks = this.tasks.filter((currentTask) => this.getTaskId(currentTask) !== taskId);

        this.message = 'Task deleted';
        this.errorMessage = '';
      },
      error: (error) => {
        this.deletingTaskId = '';
        this.message = '';
        this.errorMessage = error.error?.message || 'Could not delete task';
      }
    });

  }

  getTaskList(response: any): any[] {

    if (Array.isArray(response)) {
      return response;
    }

    return response.tasks || [];

  }

  getTaskId(task: any) {

    return task._id || task.id || '';

  }

  logout() {

    this.auth.logout();
    this.router.navigate(['/login']);

  }

}
