import { AuthService } from './../../../alpha/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'user-menu',
  templateUrl: './user-menu.component.html'
})
export class UserMenuComponent{

  constructor(private router: Router, private auth: AuthService) {}

  logOut() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
