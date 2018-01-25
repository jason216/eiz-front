import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material';

import { FuseConfigService } from '../../../core/services/config.service';
import { fuseAnimations } from '../../../core/animations';
import { AuthService } from '../../../alpha/services/auth.service';



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations : fuseAnimations
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginFormErrors: any;
  returnUrl: string;

  constructor(

    private fuseConfig: FuseConfigService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public snackBar: MatSnackBar
  ) {

    this.fuseConfig.setSettings({
      layout: {
          navigation: 'none',
          toolbar   : 'none',
          footer    : 'none'
      }
    });

    this.loginFormErrors = {
      username: {},
      password: {}
    };
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username   : ['', [Validators.required]],
      password: ['', Validators.required]
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.onLoginFormValuesChanged();
    });
  }

  onLoginFormValuesChanged()
  {
      for ( const field in this.loginFormErrors )
      {
          if ( !this.loginFormErrors.hasOwnProperty(field) )
          {
              continue;
          }

          // Clear previous errors
          this.loginFormErrors[field] = {};

          // Get the control
          const control = this.loginForm.get(field);

          if ( control && control.dirty && !control.valid )
          {
              this.loginFormErrors[field] = control.errors;
          }
      }
  }

  login(button){
    button.textContent = 'loading...';
    button.disabled = true;
    this.authService.login(this.loginForm.get('username').value, this.loginForm.get('password').value);
  }
}
