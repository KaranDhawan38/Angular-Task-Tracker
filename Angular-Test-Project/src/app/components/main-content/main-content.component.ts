import { Component, OnInit } from '@angular/core';
import { FormMode } from '../../Enums/form.mode';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit {
  showForm: boolean = false;
  formMode: FormMode = FormMode.New;

  constructor(private uiService: UiService) {
    uiService.getShowFormObservable().subscribe(value => {
      this.showForm = value;
    });
   }

  ngOnInit(): void {
  }

  toggleFormVisibility(showForm: boolean){
    this.formMode = FormMode.New;
    this.showForm = showForm;
  }

  changeToEditMode(){
    this.formMode = FormMode.Edit;
    this.showForm = true;
  }

}
