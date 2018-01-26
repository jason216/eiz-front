export class Account{

  email: string;
  companyName: string;
  ABN: string;
  phone: string;
  status: string;
  created: DateTimeFormat;

  constructor(){

  }

  loadFromAuth(param: any){
    this.email = param.email;
    this.companyName = param.companyName;
    this.ABN = param.ABN;
    this.status = param.status;
    this.created = param.created_at;
  }
}
