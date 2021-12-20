import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {Task} from '../../Task';
import { faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent implements OnInit {
  @Input() task: Task = {
    id: "dummyId",
    text: 'dummy task',
    day: 'dummy day',
    reminder: true };
  @Output() onDeleteEvent: EventEmitter<Task> = new EventEmitter();  
  @Output() toggleReminderEvent: EventEmitter<Task> = new EventEmitter();
  @Output() editTaskEvent: EventEmitter<Task> = new EventEmitter();  
  faTimes = faTimes;
  faPencilAlt = faPencilAlt;
  dateText = "";
  monthText = "";
  yearText = "";
  hoursText = "";
  minutestText = "";
  datePostfix = "";
  taskTitle = "";
  taskReminder = false;

  constructor(private uiService: UiService) {
    uiService.getTaskObservable().subscribe(value => {
      if(this.task.id === value.id){
        this.task = value;
        this.updateValues();
      }
    });
   }

  ngOnInit(): void {
    this.updateValues();
  }

  ngOnChanges(): void{
  }

  updateValues(){
    this.taskTitle = this.task.text;
    this.taskReminder = this.task.reminder;
    this.updateDate();
  }

  updateDate(){
    let date = new Date(this.task.day);
    this.dateText = date.getDate().toString();
    this.monthText = this.getMonthName(date.getMonth());
    this.yearText = date.getFullYear().toString();
    this.hoursText = date.getHours().toString();
    this.minutestText = date.getMinutes().toString();
    this.datePostfix =  this.dateText == "1" || this.dateText == "21" || this.dateText == "31" ? "st" : this.dateText == "2" || this.dateText == "22" ? "nd" : this.dateText == "3" || this.dateText == "23" ? "rd" : "th";
  }

  getMonthName(month: number){
    switch(month){
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
      default:
        return "Month Name not found";                                                                  
    }
  }

  onDeleteBtnClick(task: Task){
    this.onDeleteEvent.emit(task);
  }

  toggleReminder(task: Task){
    this.toggleReminderEvent.emit(task);
  }

  onEditBtnClick(task: Task){
    this.editTaskEvent.emit(task);
  }

}
