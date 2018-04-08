import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../../app/alpha/services';
import { ActiveContentService } from '../../../../../app/alpha/services/activeContent.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector     : 'consignment-edit',
    templateUrl  : './consignment-edit.component.html',
    styleUrls    : ['./consignment-edit.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConsignmentEditDialogComponent implements OnInit
{
    showExtraToFields = false;
    consignmentEditForm: FormGroup;
    consignmentEditFormErrors: any;
    consignment: any;

    constructor(
        public dialogRef: MatDialogRef<ConsignmentEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private activeContentService: ActiveContentService,
        private snackBar: MatSnackBar
    ){
        this.consignment = data[0];

        this.consignmentEditFormErrors = {
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
        this.consignmentEditForm = this.formBuilder.group({
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
      
          this.consignmentEditForm.valueChanges.subscribe(() => {
            this.onOrderEditFormValuesChanged();
          });
    }

    onOrderEditFormValuesChanged(){
      for ( const field in this.consignmentEditFormErrors )
      {
          if ( !this.consignmentEditFormErrors.hasOwnProperty(field) )
          {
              continue;
          }

          // Clear previous errors
          this.consignmentEditFormErrors[field] = {};

          // Get the control
          const control = this.consignmentEditForm.get(field);

          if ( control && control.dirty && !control.valid )
          {
              this.consignmentEditFormErrors[field] = control.errors;
          }
      }
    }

    submit(button) {
        if (!this.consignmentEditForm.invalid) {console.log(this.consignmentEditForm.value);
            button.textContent = 'Submiting...';
            button.disabled = true;
            this.apiService.put('Fulfillments', 'consignment', this.consignment.id, this.consignmentEditForm.value).subscribe(
                res => {
                    this.activeContentService.getConsignments();
                    this.dialogRef.close();
                },
                error => {
                    this.snackBar.open(error.error.message, 'Dismiss', {
                        duration: 15000,
                        horizontalPosition: 'right',
                        verticalPosition: 'top',
                      });
                    button.textContent = 'Submit';
                    button.disabled = false;
                }
            );
        }
    }
}
