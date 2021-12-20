import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ErrorService } from './services/error.service';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private errorService: ErrorService){
    // Do nothing.
  }

  async canActivate(): Promise<any>{
    return new Promise<boolean>(async (resolve, reject) => {
      if(!this.userService.isTokenPresent()){
        reject();
        this.router.navigate(['/login']);
     }
     else{
      await this.userService.isValidToken().then((response) => {
        resolve(true);
      }, (err) => {
        this.errorService.displayErrorMessage(err);
        reject();
      });
     }
    });
  }
}
