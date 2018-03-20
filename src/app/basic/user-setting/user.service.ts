import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../../app/alpha/services/api.service';
import { User } from '../../alpha/models/user.model';

@Injectable()
export class UserService {

    user: User;

    constructor(private apiService: ApiService) { }

    getUser() {
        return this.apiService.get('auth', 'auth', null) as Observable<User>;
    }

}
