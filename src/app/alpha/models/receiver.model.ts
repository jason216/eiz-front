export class Receiver {
         shipTo_ref: string;
         shipTo_name: string;
         shipTo_companyName: string;
         shipTo_phone: number;
         shipTo_email: string;
         shipTo_address1: string;
         shipTo_suburb: string;
         shipTo_state: string;
         shipTo_postcode: number;
         shipTo_country: string;
         shipTo_instruction1: string;

         constructor(params: any){
          this.shipTo_ref = params['shipTo_ref'];
          this.shipTo_name = params['shipTo_name'];
          this.shipTo_companyName = params['shipTo_companyName'];
          this.shipTo_phone = params['shipTo_phone'];
          this.shipTo_email = params['shipTo_email'];
          this.shipTo_address1 = params['shipTo_address1'];
          this.shipTo_suburb = params['shipTo_suburb'];
          this.shipTo_state = params['shipTo_state'];
          this.shipTo_postcode = params['shipTo_postcode'];
          this.shipTo_country = params['shipTo_country'];
          this.shipTo_instruction1 = params['shipTo_instruction1'];
         }

}
