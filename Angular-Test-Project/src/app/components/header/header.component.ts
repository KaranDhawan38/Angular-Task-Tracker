import { Component, OnInit, Output, EventEmitter, OnChanges, Input } from '@angular/core';
import { faCaretDown, faLock, faSignOutAlt, faUser, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showFormButtonText =  'Add Task +';
  hideFormButtonText =  'X';
  buttonText: string = this.showFormButtonText;
  @Input() showForm: boolean = false;
  buttonColor: string = "lightgreen";
  @Output() toggleFormEvent: EventEmitter<boolean> = new EventEmitter();
  faUser = faUser;
  faCaretDown = faCaretDown;
  faUserCog = faUserCog;
  faLock = faLock;
  faSignOutAlt = faSignOutAlt;
  @Input() username = "";

  constructor(private userService: UserService, private errorService: ErrorService) {
    window.onclick = function(event: any) {
      let targetElement = event.target;
      
      // Ignore dropdown button element.
      if(targetElement.classList.contains("user-icon-button"))
        return;

      targetElement =  !!event.target.parentElement ? event.target.parentElement : null;

      // Ignore elements inside dropdown button as they can also be clicked.
      if(targetElement){
        // Ignore fa-icon and span elements as they are inside dropdown button.
        if(targetElement.classList.contains("user-icon-button"))
          return;

        // Ignore svg element as it is inside fa-icon element.  
        targetElement =  !!event.target.parentElement.parentElement ? event.target.parentElement.parentElement : null;

        if(targetElement){
          if(targetElement.classList.contains("user-icon-button"))
            return;

          // Ignore path element as it is inside fa-icon element.  
          targetElement =  !!event.target.parentElement.parentElement.parentElement ? event.target.parentElement.parentElement.parentElement : null;
          
          if(targetElement){
            if(targetElement.classList.contains("user-icon-button"))
              return;
          }
        }
      }
      var dropdown = document.getElementsByClassName("dropdown-content")[0];

      if (dropdown && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
      }
    }
   }

  ngOnInit(): void {
    this.userService.getUsername().subscribe((data) => this.username = data.username, (err) => {
      this.errorService.displayErrorMessage(err);
    });
  }

  ngOnChanges(): void {
    this.updateAddTaskButtonAppearance();
  }

  updateAddTaskButtonAppearance(){
    if(this.showForm){
      this.buttonText = this.hideFormButtonText;
      this.buttonColor = "pink";
    }
    else{
      this.buttonText = this.showFormButtonText;
      this.buttonColor = "lightgreen";
    }
  }

  toggleAddTask() {
    this.showForm = !this.showForm;
    this.updateAddTaskButtonAppearance();
    this.toggleFormEvent.emit(this.showForm);
  }

  toggleDropdownMenu(){
    document.getElementById("userDropdown")?.classList.toggle("show");
  }

  logout(){
    this.userService.logoutUser();
  }
}
