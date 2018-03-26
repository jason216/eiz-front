import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../app/alpha/services';

@Component({
    // tslint:disable-next-line:component-selector
    selector     : 'order-edit',
    templateUrl  : './order-edit.component.html',
    styleUrls    : ['./order-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrderEditDialogComponent implements OnInit
{
    showExtraToFields = false;
    orderEditForm: FormGroup;
    orderEditFormErrors: any;
    order: any;

    constructor(
        public dialogRef: MatDialogRef<OrderEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private apiService: ApiService
    ){
        this.order = data[0];

        this.orderEditFormErrors = {
            shipTo_name: {},
            shipTo_email: {},
            shipTo_phone: {},
            shipTo_address1: {},
            // shipTo_address2: {},
            shipTo_suburb: {},
            shipTo_state: {},
            shipTo_postcode: {},
            shipTo_country: {},
        };
    }

    ngOnInit() {
        this.orderEditForm = this.formBuilder.group({
            shipTo_name   : ['', [Validators.required]],
            shipTo_email: ['', Validators.required],
            shipTo_phone: ['', Validators.required],
            shipTo_address1: ['', Validators.required],
            shipTo_address2: [''],
            shipTo_suburb: ['', Validators.required],
            shipTo_state: ['', Validators.required],
            shipTo_postcode: ['', Validators.required],
            shipTo_country: ['', Validators.required]
          });
      
          this.orderEditForm.valueChanges.subscribe(() => {
            this.onOrderEditFormValuesChanged();
          });
    }

    onOrderEditFormValuesChanged(){
      for ( const field in this.orderEditFormErrors )
      {
          if ( !this.orderEditFormErrors.hasOwnProperty(field) )
          {
              continue;
          }

          // Clear previous errors
          this.orderEditFormErrors[field] = {};

          // Get the control
          const control = this.orderEditForm.get(field);

          if ( control && control.dirty && !control.valid )
          {
              this.orderEditFormErrors[field] = control.errors;
          }
      }
    }

    submit(button) {
        button.textContent = 'Waiting...';
        button.disabled = true;
        this.apiService.post('', '', null, '').subscribe(
            res => {
            
            },
            error => {}
        );
    }
}
