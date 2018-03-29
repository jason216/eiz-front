import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { FulfillmentsFormDialogComponent } from '../../../fulfillments/components/fulfillments-form-dialog/fulfillments-form-dialog.component';
import { ApiService } from '../../../../app/alpha/services';

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
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<OrderDetailDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public apiService: ApiService
    ){
        this.order = data[0];
    }

    ngOnInit()
    {
    }

    printLabels(consignment){
        console.log(consignment);
        // tslint:disable-next-line:prefer-const
        let consignmentsIds = [];
        for (let i = 0; i < consignment.labels.length; i++) {
            consignmentsIds.push(consignment.labels[i].id);
        }
        
        this.apiService.get('fulfillments', 'printConsignments', null, {'ids[]': consignmentsIds}).subscribe(
            res => {
            window.open(res.data.url);
            }
        );
    }
}
