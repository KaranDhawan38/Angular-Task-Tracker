import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Task } from '../Task';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private showForm: boolean = false;
  private task: Task = {
    id: '',
    text: '',
    day: '',
    reminder: false 
  };
  private showFormSubject = new Subject<any>()
  private taskSubject = new Subject<any>()

  constructor() { }

  showFormChanged(showForm: boolean){
    this.showForm = showForm;
    this.showFormSubject.next(this.showForm);
  }

  taskUpdated(task: Task){
    this.task = task;
    this.taskSubject.next(this.task);
  }

  getShowFormObservable(): Observable<any>{
    return this.showFormSubject.asObservable();
  }

  getTaskObservable(): Observable<any>{
    return this.taskSubject.asObservable();
  }
}
