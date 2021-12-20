import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  headingText = "Change Password";
  btnText = "Change Password";
  oldPassword = "";
  newPassword = "";
  confirmNewPassword = "";

  constructor(private userService: UserService, private errorService: ErrorService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.validateFields()){
      let user = {
        oldPassword : this.oldPassword,
        newPassword : this.newPassword
      }
      this.userService.changePassword(user).subscribe(() => {
        alert('Password Changed!');
        this.router.navigate(['/']);
     }, this.errorService.displayErrorMessage);
    }
  }

  validateFields():boolean{
    var oldPasswordElement = document.getElementById("OldPassword");
    var newPasswordElement = document.getElementById("NewPassword");
    var confirmNewPasswordElement = document.getElementById("ConfirmNewPassword");


    if(this.oldPassword === ""){
      alert("Old Password is required!");
      oldPasswordElement?.focus();
      return false;
    }

    if(this.newPassword === ""){
      alert("New Password is required!");
      newPasswordElement?.focus();
      return false;
    }

    var passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    if(!this.newPassword.match(passwordPattern)){
      alert("Password should meet following criteria :\n 1. contains atleast one number.\n 2. contains atleast one special character.\n 2. Should be of length between 6 - 16 characters.");
      newPasswordElement?.focus();
      return false;
    }

    if(this.confirmNewPassword === ""){
      alert("Confirm New Password is required!");
      confirmNewPasswordElement?.focus();
      return false;
    }

    if(!(this.newPassword === this.confirmNewPassword)){
      alert("Password's do not match!");
      confirmNewPasswordElement?.focus();
      return false;
    }   

    return true;
  }
}
