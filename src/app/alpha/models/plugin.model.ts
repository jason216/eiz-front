export class Plugin {

    id: number;
    name: string;
    title: string;
    fee: number;
    description: string;
    subscribed: boolean;

    constructor() {
    }

    loadFromAuth(param: any) {
        this.id = param.id;
        this.name = param.name;
        this.title = param.title;
        this.fee = param.fee;
        this.description = param.description;
        this.subscribed = param.subscribed;
    }
}