import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';

import { fuseAnimations } from '../../../core/animations';
import { FuseConfigService } from '../../../core/services/config.service';


@Component({
    // tslint:disable-next-line:component-selector
    selector   : 'app-mailconfirm',
    templateUrl: './mail-confirm.component.html',
    styleUrls  : ['./mail-confirm.component.scss'],
    animations : fuseAnimations
})
export class MailConfirmComponent implements OnInit
{
    email: string;

    constructor(
        private fuseConfig: FuseConfigService,
        private route: ActivatedRoute
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

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.email = params['email'];
         });
    }
}
