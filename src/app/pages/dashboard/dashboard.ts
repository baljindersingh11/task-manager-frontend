import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
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

  tasks = signal<Task[]>([]);
  newTaskTitle = '';
  message = signal('');
  errorMessage = signal('');

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
        this.tasks.set(this.getTaskList(response));
        this.errorMessage.set('');
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Could not load tasks');
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
        this.message.set('Task created');
        this.errorMessage.set('');
      },
      error: (error) => {
        this.message.set('');
        this.errorMessage.set(error.error?.message || 'Could not create task');
      }
    });

  }

  toggleTask(task: Task) {

    const taskId = this.getTaskId(task);

    if (!taskId) {
      this.errorMessage.set('Task id is missing');
      return;
    }

    const updatedTask = {
      completed: !task.completed
    };

    this.taskService.updateTask(taskId, updatedTask).subscribe({
      next: (response) => {
        const savedTask = response.task || response;
        const completed = savedTask.completed ?? updatedTask.completed;

        this.tasks.update((tasks) => {
          return tasks.map((currentTask) => {
            if (this.getTaskId(currentTask) === taskId) {
              return {
                ...currentTask,
                completed
              };
            }

            return currentTask;
          });
        });

        this.message.set('Task updated');
        this.errorMessage.set('');
      },
      error: (error) => {
        this.message.set('');
        this.errorMessage.set(error.error?.message || 'Could not update task');
      }
    });

  }

  deleteTask(task: Task) {

    const taskId = this.getTaskId(task);

    if (!taskId) {
      this.errorMessage.set('Task id is missing');
      return;
    }

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks.update((tasks) => {
          return tasks.filter((currentTask) => this.getTaskId(currentTask) !== taskId);
        });

        this.message.set('Task deleted');
        this.errorMessage.set('');
      },
      error: (error) => {
        this.message.set('');
        this.errorMessage.set(error.error?.message || 'Could not delete task');
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
