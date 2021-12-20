import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ErrorService } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  faInfoCircle = faInfoCircle;
  headingText = "Change Account Details";
  btnText = "Update";
  email = "";
  password = "";
  confirmPassword = "";
  username = "";

  constructor(private userService: UserService, private errorService: ErrorService, private router: Router) {
    // Do nothing.  
  }

  ngOnInit(): void {
    this.userService.getUsername().subscribe((data) => {
      this.username = data.username
      this.userService.getEmail().subscribe((data) => this.email = data.email, (err) => {
        this.errorService.displayErrorMessage(err);
      });
    }, (err) => {
      this.errorService.displayErrorMessage(err);
    });
  }

  onSubmit(){
    if(this.validateFields()){
      let user = {
        username : this.username,
        email : this.email,
        password : this.password
      }
      this.userService.updateUserDetails(user).subscribe(() => {
        alert('User details updated!');
        this.router.navigate(['/']);
     }, this.errorService.displayErrorMessage);
     }
  }

  validateFields():boolean{
    var emailElement = document.getElementById("Email");
    var passwordElement = document.getElementById("Password");
    var usernameElement = document.getElementById("Username");

    if(this.username === ""){
      alert("Username is required!");
      usernameElement?.focus();
      return false;
    }

    if(this.email === ""){
      alert("Email is required!");
      emailElement?.focus();
      return false;
    }
    var emailpattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if(!this.email.match(emailpattern)){
      alert("Enter a valid Email!");
      emailElement?.focus();
      return false;
    }

    if(this.password === ""){
      alert("Password is required!");
      passwordElement?.focus();
      return false;
    }

    return true;
  }
}
