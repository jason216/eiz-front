import { Plugin } from '../../alpha/models/plugin.model';

export class Account{

  email: string;
  companyName: string;
  ABN: string;
  phone: string;
  status: string;
  created_at: DateTimeFormat;
  plugins: Plugin[];

  constructor(){

  }

  loadFromAuth(param: any){
    this.email = param.email;
    this.companyName = param.companyName;
    this.ABN = param.ABN;
    this.status = param.status;
    this.created_at = param.created_at;
    this.plugins = param.plugins;
  }
}
