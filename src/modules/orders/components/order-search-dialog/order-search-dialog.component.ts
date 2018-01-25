import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'order-search-dialog',
  templateUrl: './order-search-dialog.component.html',
})
export class OrderSearchDialogComponent {

  keywords: string;
  selectedSearchScopes: string;
  foods = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];
  searchScopes = [
    { value: 'orderlines', viewValue: 'Orderlines' },
    { value: 'buyerinfo', viewValue: 'Buyer Info' },
    { value: 'salesrecordnumber', viewValue: 'SRN' },
    { value: 'all', viewValue: 'All' }
  ];

  constructor(
    public dialogRef: MatDialogRef<OrderSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick(): void {
    if (this.selectedSearchScopes){
      if (this.selectedSearchScopes !== 'all') {
        this.data['searchin'] = this.selectedSearchScopes;
        this.selectedSearchScopes = '';
      }
    }

    if (this.keywords){
      this.data['search'] = this.keywords;
      this.keywords = '';
    }
    this.dialogRef.close(this.data);
  }
}
