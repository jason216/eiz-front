import { ActiveContentService } from './activeContent.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import * as moment from 'moment-timezone';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ApiService } from './api.service';

import {User} from '../models/user.model';
import { resolve } from 'q';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class AuthService {

  user: User;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private activeContentService: ActiveContentService,
    public snackBar: MatSnackBar,
  ) {}

  public isAuthenticated(): Promise<boolean> {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      if (!localStorage.getItem('token') || !this.isExpiration){
        resolve(false);
      }else if (this.isActive() && this.user && this.user.account){
        resolve(true);
      }else{
        this.renewToken().subscribe(
          res => {
              resolve(true);
          },
          err => {
            this.snackBar.open('123', 'Got it', {
              duration: 2000,
            });
            resolve(false);
          }
        );
      }
    });
  }

  private renewToken(){
    return this.apiService.post('auth', 'update').map(
        res => {
          if (res['data']){
            this.setSession(res['data']);
          }
        },
        err => {
          console.log(`Error in auth-renew-token: ${err}`);
        }
      );
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
    const expiresAt = moment.tz(authResult['expires_at'], 'Australia/Melbourne'); // moment().add(authResult['expires_at'], 'second');
    const activeAt = moment.tz(authResult['refresh_expires_at'], 'Australia/Melbourne'); // moment().add(authResult['refresh_expires_at'] , 'second');
    localStorage.setItem('token', authResult['token']);
    localStorage.setItem('refresh_expires_at', JSON.stringify(activeAt.valueOf()) );
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()) );
    this.apiService.get('auth', 'auth').subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      res => {
        this.user.loadFromAuth(res.data);
        this.activeContentService.startActiveContent();
      }
    );
  }

  private getStorageTime(itemName: string){
    const item = JSON.parse(localStorage.getItem(itemName));
    return moment(item);
  }

  private isExpiration(){
    const expirationTime = this.getStorageTime('refresh_expires_at');
    const now = moment().subtract(1, 'm');
    if (now.isBefore(expirationTime)) {
      return true;
    } else {
      return false;
    }
  }

  private isActive() {
    const activeTime = this.getStorageTime('expires_at');
    const now = moment().subtract(1, 'm');
    if (now.isBefore(activeTime)) {
      return true;
    }else{
      return false;
    }
    // return true;
  }

}
