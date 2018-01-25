import { Component, Input } from '@angular/core';

@Component({
  selector: 'table-orderlines-cell',
  templateUrl: './table-orderlines-cell.component.html',
})
export class TableOrderlinesCellComponent {
  @Input() orderlines?: any;
  constructor() {
  }

}
