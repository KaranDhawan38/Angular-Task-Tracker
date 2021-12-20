import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormMode } from 'src/app/Enums/form.mode';
import { Task } from '../../Task';

@Component({
  selector: 'app-add-update-task',
  templateUrl: './add-update-task.component.html',
  styleUrls: ['./add-update-task.component.css']
})
export class AddUpdateTaskComponent implements OnInit, OnChanges {
  @Input() showForm = false;
  @Input() formMode: FormMode = FormMode.New;
  @Output() submitEvent = new EventEmitter();
  @Output() editTaskEvent = new EventEmitter();
  addTaskText: string = "Add a new task";
  updateTaskText: string = "Update task";
  headingText: string = this.addTaskText;
  addTaskBtnText: string = "Save";
  updateTaskBtnText: string = "Update";
  saveBtnText: string = this.addTaskBtnText;
  @Input() task: Task = {
    id: '',
    text: '',
    day: '',
    reminder: false 
  };

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.headingText = this.formMode == FormMode.New ? this.addTaskText : this.updateTaskText;
    this.saveBtnText = this.formMode == FormMode.New ? this.addTaskBtnText : this.updateTaskBtnText;
  }

  onSubmit(){
    if(!this.task.text){
      alert("Task Name is required!");
      return;
    }

    if(!this.task.day){
      alert("Due Date is required!");
      return;
    }

    if(this.formMode === FormMode.New){
      this.submitEvent.emit(this.task);
    }
    else{
      this.editTaskEvent.emit(this.task);
    }
    if(this.formMode === FormMode.New){
      this.task.text = this.task.day = "";
      this.task.reminder = false;
    }
  }

}
