export class Consignment {
    id: number;
    shippingMethod_id: number = 0;
    shippingMethod_cost: number = 0;
    data: any[] = [{ qty: 0, length: 0, width: 0, height: 0}];

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
      let returnString = {
        shippingMethod_id: this.shippingMethod_id,
        shipTo_ref: params["shipTo_ref"],
        shipTo_name: params["shipTo_name"],
        shipTo_companyName: params["shipTo_companyName"],
        shipTo_phone: params["shipTo_phone"],
        shipTo_email: params["shipTo_email"],
        shipTo_address1: params["shipTo_address1"],
        shipTo_suburb: params["shipTo_suburb"],
        shipTo_state: params["shipTo_state"],
        shipTo_postcode: params["shipTo_postcode"],
        shipTo_country: params["shipTo_country"],
        shipTo_instruction1: params["shipTo_instruction1"],
        data: this.data
      };
      return returnString;
    }
}
