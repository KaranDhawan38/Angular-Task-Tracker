import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRight, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ErrorService } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  headingText = "Reset Password";
  btnText = "Next";
  email = "";
  verificationCode = "";
  newPassword = "";
  confirmNewPassword = "";
  faInfoCircle = faInfoCircle;
  faArrowRight = faArrowRight;
  isVerificationCodeSent = false;
  emailSentPending = false;
  showLoader = false;

  constructor(private userService: UserService, private errorService: ErrorService, private router: Router) { }

  ngOnInit(): void {
  }

  async onSubmit(){
    if(this.emailSentPending){
      return;
    }

    if(this.validateFields()){
      if(!this.isVerificationCodeSent){
        let user = {
          email : this.email
        }
        this.emailSentPending = true;
        this.showLoader = true;
        await this.userService.sendVerificationCodeEmail(user).then(() => {
          alert('A verification code has been sent on email : ' + this.email + ' !');
          this.isVerificationCodeSent = true;
       }, this.errorService.displayErrorMessage);
       this.emailSentPending = false;
       this.showLoader = false;
      }
      else{
        let data = {
          email : this.email,
          verificationCode : this.verificationCode,
          newPassword : this.newPassword
        }
        this.userService.resetPassword(data).subscribe(() => {
          alert('Password has been reset!');
          this.router.navigate(['/login']);
       }, this.errorService.displayErrorMessage);
      }
     }
  }

  validateFields():boolean{
    if(!this.isVerificationCodeSent){
      var emailElement = document.getElementById("Email");

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
    }
    else{
      var verificationCodeElement = document.getElementById("VerificationCode");
      var newPasswordElement = document.getElementById("NewPassword");
      var confirmNewPasswordElement = document.getElementById("ConfirmNewPassword");

      if(this.verificationCode === ""){
        alert("Verification Code is required!");
        verificationCodeElement?.focus();
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
    }

    return true;
  }

}
