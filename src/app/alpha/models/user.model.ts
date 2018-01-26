import {Account} from './account.model';

export class User{

  email: string;
  name: string;
  role: string;
  active: boolean;
  created: DateTimeFormat;

  account: Account;

  constructor(){}

   loadFromAuth(params: any){
    this.email = params.email;
    this.name = params.name;
    this.role = params.role;
    this.active = params.active;
    this.created = params.created_at;
    const account = new Account();
    account.loadFromAuth(params.account);
    this.account = account;
   }

}
