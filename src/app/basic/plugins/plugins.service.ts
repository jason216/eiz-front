import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ApiService } from '../../alpha/services/api.service';

@Injectable()
export class PluginsService implements Resolve<any>
{
    // onCategoriesChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onPluginsChanged: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(private apiService: ApiService)
    {
    }

    /**
     * The Academy App Main Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                // this.getCategories(),
                this.getPlugins()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getCategories(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            // this.http.get('api/academy-categories')
            //     .subscribe((response: any) => {
            //         this.onCategoriesChanged.next(response);
            //         resolve(response);
            //     }, reject);
        });
    }

    getPlugins(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.apiService.get('account', 'allPlugins').subscribe(
              (res) => {
                this.onPluginsChanged.next(res.data);
                resolve(res);
              },
              reject
            );
            // this.http.get('api/academy-courses')
            //     .subscribe((response: any) => {
            //         this.onCoursesChanged.next(response);
            //         resolve(response);
            //     }, reject);
        });
    }

}
