import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private router: Router) { }

  /**
   * This method will display error on UI.
   * @param err The err obj that will be used to display error
   */
   displayErrorMessage(err : any){
    if(err){
      if(err.error){
        alert(err.error);
      }
      else{
        alert(err.message);
      }
      // Redirect to login page if error status code is 401(Unauthorized).
      if(err.status === 401){
        this.router.navigate(['/login']);
      }
    }
    else{
      alert("Error : Something went wrong :(");
    }
  }
}
