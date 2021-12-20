import { Injectable } from '@angular/core';
import {Task} from '../Task';
import {TASKS} from '../mock-tasks';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
   headers: new HttpHeaders({
     'Content-type': 'application/json'
   })
};

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  //private apiURL = 'http://localhost:5000/tasks'; //Used for JSON Server
  private apiURL = 'http://localhost:3000'; // Used for Express MongoDB backend 

  constructor(private http:HttpClient) { }

  getTasks(): Observable<Task[]>{
    const url = `${this.apiURL}/getTasks`;
    return this.http.get<Task[]>(url);
  }

  deleteTask(task: Task): Observable<any>{
    const url = `${this.apiURL}/deleteTask`;
    return this.http.post<any>(url, {id: task.id}, httpOptions);
  }

  toggleReminder(task: Task): Observable<Task>{
    const url = `${this.apiURL}/toggleReminder`;
    return this.http.put<Task>(url, {id: task.id, reminder: task.reminder}, httpOptions);
  }

  addTask(task: Task): Observable<Task>{
    const url = `${this.apiURL}/saveTask`;
    return this.http.post<Task>(url, task, httpOptions);
  }

  updateTask(task: Task): Observable<Task>{
    const url = `${this.apiURL}/updateTask`;
    return this.http.put<Task>(url, task, httpOptions);
  }
}
