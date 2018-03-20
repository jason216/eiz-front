import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { fuseAnimations } from '../../../core/animations';
import { FuseConfigService } from '../../../core/services/config.service';
import { AuthService } from '../../../alpha/services/auth.service';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations : fuseAnimations,
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  registerFormErrors: any;

  constructor(
      private fuseConfig: FuseConfigService,
      private formBuilder: FormBuilder,
      private http: HttpClient,
      private authService: AuthService,
      private router: Router,
      private route: ActivatedRoute,
      private snackBar: MatSnackBar
  )
  {
      this.fuseConfig.setSettings({
          layout: {
              navigation: 'none',
              toolbar   : 'none',
              footer    : 'none'
          }
      });

      this.registerFormErrors = {
          // username       : {},
          email          : {},
          password       : {},
          passwordConfirm: {},
          terms          : {}
      };
  }

  ngOnInit()
  {
      this.registerForm = this.formBuilder.group({
          // username       : ['', Validators.required],
          email          : ['', [Validators.required, Validators.email]],
          password       : ['', Validators.required],
          passwordConfirm: ['', [Validators.required, confirmPassword]],
          terms          : ['', Validators.required]
      });

      this.registerForm.valueChanges.subscribe(() => {
          this.onRegisterFormValuesChanged();
      });
  }

  onRegisterFormValuesChanged()
  {
      for ( const field in this.registerFormErrors )
      {
          if ( !this.registerFormErrors.hasOwnProperty(field) )
          {
              continue;
          }

          // Clear previous errors
          this.registerFormErrors[field] = {};

          // Get the control
          const control = this.registerForm.get(field);

          if ( control && control.dirty && !control.valid )
          {
              this.registerFormErrors[field] = control.errors;
          }
      }
  }

  register(button){
    button.textContent = 'Loading...';
    button.disabled = true;
    this.http.post('http://app.eiz.com.au/api/auth/register', this.registerForm.value, {}).subscribe(
        (resp: any) => {
            this.router.navigate(['/register/mailconfirm', { email: resp.data.emailSentTo }]);
        }, 
        error => {
            this.snackBar.open(error.error.message, 'Dismiss', {
                duration: 15000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
              });
            button.textContent = 'CREATE AN ACCOUNT';
            button.disabled = false;
        }
    );
  }
}

function confirmPassword(control: AbstractControl)
{
  if ( !control.parent || !control )
  {
      return;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if ( !password || !passwordConfirm )
  {
      return;
  }

  if ( passwordConfirm.value === '' )
  {
      return;
  }

  if ( password.value !== passwordConfirm.value )
  {
      return {
          passwordsNotMatch: true
      };
  }
}


