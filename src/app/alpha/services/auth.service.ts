import { ActiveContentService } from './activeContent.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ApiService } from './api.service';

import {User} from '../models/user.model';

@Injectable()
export class AuthService {

  user: User;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private activeContentService: ActiveContentService,
  ) {}

  public isAuthenticated(){
    if (!this.isActive()){
      this.renewToken();
    }
    if (this.isLoggedIn() && this.isActive() ){
      return true;
    }
    return false;
  }
  private renewToken() {
    // this.apiService.post('auth', 'update').toPromise.
  //   this.apiService.post('auth', 'update').subscribe(
  //     res => {
  //       if (res['data']){
  //         this.setSession(res['data']);
  //       }
  //     },
  //     err => {
  //       console.log(`Error in auth-renew-token: ${err}`);
  //     },
  //     () => {
  //       console.log('auth-renew-token Completed');
  //     }
  //   );
  }

  public login(username: string, password: string ) {
    return this.apiService.post('auth', 'auth', null, { email: username, password: password }).map(
      res => {
        if (res['data']) {
          this.setSession(res['data']);
        }
      }
    );
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_expires_at');
    localStorage.removeItem('expires_at');
    this.activeContentService.endActiveContent();
    this.router.navigate(['/login']);
  }

  private setSession(authResult) {
    const expiresAt = moment().add(authResult['expires_at'], 'second');
    const activeAt = moment().add(authResult['refresh_expires_at'] , 'second');
    localStorage.setItem('token', authResult['token']);
    localStorage.setItem('refresh_expires_at', JSON.stringify(activeAt.valueOf()) );
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()) );
  }

  private isLoggedIn() {
    if (localStorage.getItem('token')){
      this.apiService.get('auth', 'auth').subscribe(
        // tslint:disable-next-line:no-shadowed-variable
        res => {
          this.user.loadFromAuth(res.data);
          this.activeContentService.startActiveContent();
        }
      );
      return true;
    }
    return false;
  }

  private getStorageTime(itemName: string){
    const item = JSON.parse(localStorage.getItem(itemName));
    return moment(item);
  }
  private getExpiration() {
    return this.getStorageTime('refresh_expires_at');
  }

  private isExpiration(){
    const expirationTime = this.getExpiration();
    const now = moment().subtract(1, 'm');
    if (now.isBefore(expirationTime)) {
      return true;
    } else {
      return false;
    }
  }
  private getActive() {
    return this.getStorageTime('expires_at');
  }
  private isActive() {
    const activeTime = this.getActive();
    const now = moment().subtract(1, 'm');
    if (now.isBefore(activeTime)) {
      return true;
    }else{
      return false;
    }
    // return true;
  }

}
