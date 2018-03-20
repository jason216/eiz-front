import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../../alpha/models/user.model';
import { UserService } from './user.service';



@Injectable()
export class UserResolver implements Resolve<User> {

    user: User;

    constructor(private userService: UserService) { }
    
    resolve() {
        return this.userService.getUser();
    }
}
