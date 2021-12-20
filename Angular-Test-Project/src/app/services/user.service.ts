import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from '../User';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiURL = 'http://localhost:3000'; // Used for Express MongoDB backend 

  constructor(private http:HttpClient, private router: Router) { }

  /**
   * This method is used to create a user.
   */
  createUser(user: User): Observable<User>{
    const url = `${this.apiURL}/createUser`;
    return this.http.post<User>(url, user, httpOptions);
  }

  /**
   * This method is used to login the user.
   */
  login(user: User): Observable<any>{
    const url = `${this.apiURL}/login`;
    return this.http.post<User>(url, user, httpOptions);
  }

  /**
   * This method is used to get username of logged in user.
   */
  getUsername(){
    const url = `${this.apiURL}/getUsername`;
    return this.http.get<any>(url);
  }

  /**
   * This method is used to get email id of logged in user.
   */
  getEmail(){
    const url = `${this.apiURL}/getEmail`;
    return this.http.get<any>(url);
  }

  /**
   * This method is used to change the details(username and email id) of user.
   */
  updateUserDetails(user: any){
    const url = `${this.apiURL}/updateUserDetails`;
    return this.http.post<any>(url, user, httpOptions);
  }

  /**
   * This method is used to send email containing the verification code.
   */
   sendVerificationCodeEmail(user: any){
    const url = `${this.apiURL}/sendVerificationCodeEmail`;
    return this.http.post<any>(url, user, httpOptions).toPromise();
  }

  /**
   * This method is used to reset password.
   */
   resetPassword(data: any){
    const url = `${this.apiURL}/resetPassword`;
    return this.http.post<any>(url, data, httpOptions);
  }

  /**
   * This method is used to change the password of user.
   */
   changePassword(user: any){
    const url = `${this.apiURL}/changePassword`;
    return this.http.post<any>(url, user, httpOptions);
  }

  /**
   * This method is used to check wheather the token is valid or not.
   */
  async isValidToken(): Promise<any>{
    const url = `${this.apiURL}/verifyToken`;
    return await this.http.get<any>(url).toPromise();
  }

  /**
   * This method will return wheather token is present in session storage or not.
   */
  isTokenPresent(): boolean{
    return !!sessionStorage.getItem('token'); // !! will convert value to boolean and return. 
  }

  /**
   * This method will logout the current user.
   */
  logoutUser(){
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

   /**
   * This method will return the token stored in session storage.
   */
  getToken(){
    return sessionStorage.getItem('token');
  }
}
