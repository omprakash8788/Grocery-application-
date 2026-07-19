import {User, DeliveryPartner } from "../../generated/prisma/client.ts";

// 32
declare global {
    namespace Express{
        interface Request{
            user?:{
                id:string,
                isAdmin?:boolean;
            },
            partner?:DeliveryPartner
        }
    }
}
export {};