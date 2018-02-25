export class Consignment {
    id: number;
    shippingMethod_id = 0;
    shippingMethod_cost = 0;
    data: any[] = [{ qty: 1, weight: 0.5, length: 12, width: 12, height: 12}];

    constructor(id: number, shippingMethod_id?: number, shippingMethod_cost?: number, data?: any[]){
      this.id = id;
      if (shippingMethod_id){
        this.shippingMethod_id = shippingMethod_id;
      }
      if (shippingMethod_cost) {
        this.shippingMethod_cost = shippingMethod_cost;
      }
      if (data){
        this.data = data;
      }
    }

    clone() {
      return new Consignment(this.id, this.shippingMethod_id, this.shippingMethod_cost, this.data);
    }

    transToJson(params){
      const returnString = {
        shippingMethod_id: this.shippingMethod_id,
        shipTo_ref: params['shipTo_ref'],
        shipTo_name: params['shipTo_name'],
        shipTo_companyName: params['shipTo_companyName'],
        shipTo_phone: params['shipTo_phone'],
        shipTo_email: params['shipTo_email'],
        shipTo_address1: params['shipTo_address1'],
        shipTo_suburb: params['shipTo_suburb'],
        shipTo_state: params['shipTo_state'],
        shipTo_postcode: params['shipTo_postcode'],
        shipTo_country: params['shipTo_country'],
        shipTo_instruction1: params['shipTo_instruction1'],
        data: this.data
      };
      return returnString;
    }
}
