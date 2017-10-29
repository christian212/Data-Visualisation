// auth.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild } from '@angular/router';
import { UserService } from './shared/services/user.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private user: UserService,private router: Router) {}

  canActivate() {

    if(!this.user.isLoggedIn())
    {
       this.router.navigate(['/login']);
       return false;
    }

    return true;
  }

  canActivateChild() {
    
        if(!this.user.isLoggedIn())
        {
           this.router.navigate(['/login']);
           return false;
        }
    
        return true;
      }
}