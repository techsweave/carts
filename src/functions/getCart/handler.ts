import 'source-map-support/register';

import CartRow from '@dbModel/tables/cart';
import getCart from './function';
import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response, AuthenticatedUser } from 'utilities-techsweave';
import { StatusCodes } from 'http-status-codes';

/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is type of 'Cart'
*/
const getCartHandler: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
    let res: Response<CartRow> = new Response<CartRow>();
    try {

        let userId: string;
        if (event.headers?.accesstoken) {
            const user: AuthenticatedUser = await AuthenticatedUser.fromToken(event.headers?.accesstoken);
            userId = await user.getUserId();
        } else {
            userId = event.headers?.sessionId;
        }

        const cart = await getCart(userId);
        res = await Response.fromMultipleData(cart.items, StatusCodes.OK, cart.lastKey);
    } catch (error) {
        res = await Response.fromError<CartRow>(error);
    }
    return res.toAPIGatewayProxyResult();
};
export const main = middyfy(getCartHandler);