import { Component, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'table-orderlines-cell',
  templateUrl: './table-orderlines-cell.component.html',
})
export class TableOrderlinesCellComponent {
  @Input() orderlines?: any;
  constructor() {
  }

}
