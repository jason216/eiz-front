import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { fuseAnimations } from '../../../core/animations';
import { FuseConfigService } from '../../../core/services/config.service';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'user-active',
    templateUrl: './user-active.component.html',
    styleUrls: ['./user-active.component.scss'],
    animations : fuseAnimations
})
export class ActiveComponent implements OnInit {

    email: string;
    hash: string;

    constructor(
        private fuseConfig: FuseConfigService,
        private route: ActivatedRoute,
        private http: HttpClient
    )
    {
        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
        this.email = params.email;
        this.hash = params.hash;

        this.http.get('http://app.eiz.com.au/api/auth/verifyAccount', params).subscribe(
            res => {
                console.log(res);

            }
          );
      });
    }
}
