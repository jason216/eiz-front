import { HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ApiService {
  private url: string;
  private activeRequests = 0;

  constructor(private httpClient: HttpClient) {
    this.url = environment.apiUrl;
  }
  public get(endpoint: string, target: string, param?: string, query?: any): Observable<any> {

    let resourceUrl = this.url + '/' + endpoint + '/' + target;
    if (param){
      resourceUrl += '/' + param;
    }
    // let httpParams: HttpParams;
    // if (query) {
    //   httpParams = new HttpParams({fromObject: query});
    //   resourceUrl = this.url + '/' + endpoint + '/' + target + '/' + param + '?' + query;
    // }

    if (endpoint === 'auth') {
      resourceUrl = this.url + '/' + target;
    }
    ++this.activeRequests;

    return this.httpClient
            .get(resourceUrl, {params: query} )
      .catch((error: any) => this.handleError(error));
  }

  public post(endpoint: string, target: string, param?: string, data?: any): Observable<any> {

    let resourceUrl = this.url + '/' + endpoint + '/' + target;
    if (endpoint === 'auth') {
      resourceUrl = this.url + '/' + target;
    }

    if (param){
      resourceUrl += '/' + param;
    }

    ++this.activeRequests;

    return this.httpClient
            .post(resourceUrl, data)
      .catch((error: HttpErrorResponse) => this.handleError(error));
      //      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  public put(endpoint: string, target: string, param?: string, data?: any): Observable<any> {

    let resourceUrl = this.url + '/' + endpoint + '/' + target;
    if (endpoint === 'auth') {
      resourceUrl = this.url + '/' + target;
    }

    if (param){
      resourceUrl += '/' + param;
    }

    ++this.activeRequests;

    return this.httpClient
            .put(resourceUrl, data)
      .catch((error: HttpErrorResponse) => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    error = error.error;
    const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error' ;

    return Observable.throw(errMsg);
  }
  public isLoading() {
    return (this.activeRequests > 0 ? true : false);
  }

  private loadingDone() {
    if (--this.activeRequests < 0) {
      this.activeRequests = 0;
    }
  }
}
