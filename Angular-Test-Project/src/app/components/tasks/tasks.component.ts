import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import {Task} from '../../Task';
import { TaskService } from 'src/app/services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';
import { FormMode } from 'src/app/Enums/form.mode';
import { UiService } from 'src/app/services/ui.service';
import { UUID } from 'angular2-uuid';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  @Input() showForm: boolean = false;
  @Input() formMode: FormMode = FormMode.New;
  task: Task = {
    id: '',
    text: '',
    day: '',
    reminder: false 
  };
  @Output() changeToEditModeEvent = new EventEmitter();

  constructor(private taskService: TaskService, private uiService: UiService, private errorService: ErrorService) {
    uiService.getShowFormObservable().subscribe(value => {
      this.showForm = value;
    });
    // let taskService = new TaskService();
     //this.tasks = this.taskService.getTasks();
   }

  ngOnInit(): void {
    //this.tasks = this.taskService.getTasks();
    this.taskService.getTasks().subscribe((tasks) => (this.tasks = tasks), (err) => {
      this.errorService.displayErrorMessage(err);
    });
  }

  ngOnChanges(): void {
    if(this.formMode === FormMode.New){
      this.task = {
        id: '',
        text: '',
        day: '',
        reminder: false 
      };
    }
  }

  deleteTask(task: Task){
    this.taskService.deleteTask(task).subscribe((task) => {
      this.tasks = this.tasks.filter((t) => t.id !== task.id);
      }, (err) => {
        this.errorService.displayErrorMessage(err);
      });
  }

  toggleReminder(task: Task){
    task.reminder = !task.reminder;
    this.taskService.toggleReminder(task).subscribe(() => {
      this.uiService.taskUpdated(task);
    }, (err) => {
      this.errorService.displayErrorMessage(err);
    });
  }

  addTask(task: Task){
    task.id = UUID.UUID();
    this.taskService.addTask(task).subscribe((task) => {
      this.tasks.push(task);
      this.uiService.showFormChanged(false);
    }, (err) => {
      this.errorService.displayErrorMessage(err);
    });
  }

  editTask(task: Task){
    this.showForm = true;
    this.formMode = FormMode.Edit;
    this.task = task;
    this.changeToEditModeEvent.emit();
  }

  updateTask(task: Task){
    this.taskService.updateTask(task).subscribe(() => {
      this.uiService.showFormChanged(false);
      this.uiService.taskUpdated(task);
    }, (err) => {
      this.errorService.displayErrorMessage(err);
    });
  }
}
