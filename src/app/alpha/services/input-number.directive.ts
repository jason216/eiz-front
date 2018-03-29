import { Directive } from '@angular/core';
import { NgModel } from '@angular/forms';

// 自定义指令
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'input[number]',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(keypress)': 'onkeypress($event)',
    '(keyup)': 'onkeyup($event)'
  },
  // tslint:disable-next-line:use-input-property-decorator
  inputs: ['maxValue'],
})

export class InputNumberDirective {
  maxValue: number;

  constructor(public control: NgModel) {console.log(999);
  }

  onkeyup(event) {console.log(111);
    // tslint:disable-next-line:prefer-const
    let input = event.target;
    if (input.value === 111) {alert(222);
      input.value = 0;
      this.control.viewToModelUpdate(0);
    }

    // tslint:disable-next-line:radix
    const newValue = parseInt(input.value);
    if (newValue > this.maxValue) {
      input.value = this.maxValue;
      this.control.viewToModelUpdate(this.maxValue);
    }
    else
    {
      input.value = newValue;
      this.control.viewToModelUpdate(newValue);
    }

  }

  onkeypress(event) {console.log(333);
    // 判断是否为数字
    const inputStr = String.fromCharCode(event.keyCode); console.log(inputStr);
    // tslint:disable-next-line:radix
    console.log(parseInt(inputStr));
    // tslint:disable-next-line:radix
    if (!parseInt(inputStr)) {
      return false;
    }
  }
}
