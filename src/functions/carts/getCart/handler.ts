import 'source-map-support/register';

import CartRow from '@dbModel/tables/cart';
import getCart from '@carts/getCart/function';

import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response, HttpStatusCodes } from 'utilities-techsweave';
/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is type of 'Cart'
*/
const getCartHandler: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
    let res: Response<CartRow> = new Response<CartRow>();
    try {
        const scanRes = await getCart('customerDefault');
        res = Response.fromMultipleData(scanRes.items, HttpStatusCodes.OK, scanRes.lastKey);
    } catch (error) {
        res = Response.fromError<CartRow>(error);
    }
    return res.toAPIGatewayProxyResult();
};
export const main = middyfy(getCartHandler);