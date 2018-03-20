import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from '../../../app/alpha/services/api.service';
import { FuseConfigService } from '../../core/services/config.service';
import { fuseAnimations } from '../../core/animations';
import { User } from '../../alpha/models/user.model';
import { Account } from '../../alpha/models/account.model';
import { Plugin } from '../../alpha/models/plugin.model';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss'],
  animations: fuseAnimations
})
export class UserSettingComponent implements OnInit {

  data: any;
  user: User;
  account: Account;
  plugins: Plugin[];

  doEdit: boolean;

  editUserForm: FormGroup;
  editUserFormErrors: any;

  constructor(
    private fuseConfig: FuseConfigService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.fuseConfig.setSettings({
      layout: {
        navigation: 'left',
        toolbar: 'below',
        footer: 'none'
      }
    });

    this.editUserFormErrors = {
      name: {}
    };
  }

  ngOnInit() {
    this.data = this.route.snapshot.data;
    this.user = this.data.user.data;
    this.account = this.user.account;
    this.plugins = this.account.plugins;

    this.editUserForm = this.formBuilder.group({
      name   : ['', [Validators.required]]
    });

    this.editUserForm.valueChanges.subscribe(() => {
      this.onEditUserFormValuesChanged();
    });
  }

  private onEditUserFormValuesChanged()
  {
      for ( const field in this.editUserFormErrors )
      {
          if ( !this.editUserFormErrors.hasOwnProperty(field) )
          {
              continue;
          }

          // Clear previous errors
          this.editUserFormErrors[field] = {};

          // Get the control
          const control = this.editUserForm.get(field);

          if ( control && control.dirty && !control.valid )
          {
              this.editUserFormErrors[field] = control.errors;
          }
      }
  }

  showEdit(button)
  {
    if ( this.doEdit ) {
      this.doEdit = false;
    }
    else {
      this.doEdit = true;
    }
  }

  editSubmit(button)
  {
    button.textContent = 'Loading...';
    button.disabled = true;
    this.http.post('http://app.eiz.com.au/api/auth/register', this.editUserForm.value, {}).subscribe(
        (resp: any) => {
          this.doEdit = false;
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
