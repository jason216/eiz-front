import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    // tslint:disable-next-line:component-selector
    selector     : 'order-detail',
    templateUrl  : './order-detail.component.html',
    styleUrls    : ['./order-detail.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrderDetailDialogComponent implements OnInit
{
    showExtraToFields = false;
    composeForm: FormGroup;
    order: any;
    constructor(
        public dialogRef: MatDialogRef<OrderDetailDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ){
        this.order = data[0];
        console.log(this.order);
    }

    ngOnInit()
    {
    }

    
}
