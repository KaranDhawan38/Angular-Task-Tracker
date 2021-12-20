import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { ErrorService } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  headingText = "Login";
  btnText = "Login";
  username = "";
  password = "";
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
     this.user.username = this.username;
     this.user.password = this.password;
     this.userService.login(this.user).subscribe((token) => {
       sessionStorage.setItem('token', token.id);
       this.router.navigate(['/']);
    }, this.errorService.displayErrorMessage);
    }
  }

  validateFields():boolean{
    var usernameElement = document.getElementById("Username");
    var passwordElement = document.getElementById("Password");

    if(this.username === ""){
      alert("Username is required!");
      usernameElement?.focus();
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
