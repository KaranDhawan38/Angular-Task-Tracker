import { Component, OnInit} from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../User';
import { UUID } from 'angular2-uuid';
import {Router} from "@angular/router"
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ErrorService } from 'src/app/services/error.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  faInfoCircle = faInfoCircle;
  appName = "Task Tracker";
  headingText = "Sign Up";
  btnText = "Sign Up";
  email = "";
  password = "";
  confirmPassword = "";
  username = "";
  user: User = {
    id: "dummyId",
    username: "dummyName",
    email: "dummy@dummy.com",
    password: "dummy@123"
  }

  constructor(private userService: UserService, private router: Router, private errorService: ErrorService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.validateFields()){
     this.user.id = UUID.UUID();
     this.user.username = this.username;
     this.user.email = this.email;
     this.user.password = this.password;
     this.userService.createUser(this.user).subscribe((user) => {
       alert('User with Username : "' + user.username + '" Created.');
       this.router.navigate(['/login']);
    }, this.errorService.displayErrorMessage);
    }
  }

  validateFields():boolean{
    var emailElement = document.getElementById("Email");
    var passwordElement = document.getElementById("Password");
    var confirmPasswordElement = document.getElementById("ConfirmPassword");
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
    var passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    if(!this.password.match(passwordPattern)){
      alert("Password should meet following criteria :\n 1. contains atleast one number.\n 2. contains atleast one special character.\n 2. Should be of length between 6 - 16 characters.");
      passwordElement?.focus();
      return false;
    }

    if(this.confirmPassword === ""){
      alert("Confirm Password is required!");
      confirmPasswordElement?.focus();
      return false;
    }

    if(!(this.password === this.confirmPassword)){
      alert("Password's do not match!");
      confirmPasswordElement?.focus();
      return false;
    }

    return true;
  }
}
