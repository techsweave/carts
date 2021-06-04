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
        if (event.headers?.AccessToken) {
            const user: AuthenticatedUser = await AuthenticatedUser.fromToken(event.headers?.AccessToken);
            userId = await user.getUserId();
        } else {
            userId = event.headers?.sessionId;
        }

        const scanRes = await getCart(userId);
        res = Response.fromMultipleData(scanRes.items, StatusCodes.OK, scanRes.lastKey);
    } catch (error) {
        res = Response.fromError<CartRow>(error);
    }
    return res.toAPIGatewayProxyResult();
};
export const main = middyfy(getCartHandler);