import { HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TokenIterceptorService implements HttpInterceptor {

  constructor(private userService: UserService) { }

  intercept(req: any, next: any){
    let tokenizedReq = req.clone({
      setHeaders: {
        Authorization : `Bearer ${this.userService.getToken()}`
      }
    });
    return next.handle(tokenizedReq);
  }
}
