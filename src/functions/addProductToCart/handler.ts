import 'source-map-support/register';

import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response, AuthenticatedUser } from 'utilities-techsweave';
import { StatusCodes } from 'http-status-codes';
import CartRow from '@dbModel/tables/cart';
import addProductToCart from './function';
import schema from '@functions/addProductToCart/schema';

const addProductToCartHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    let response: Response<CartRow>;
    try {
        const cartRow = new CartRow();

        if (event.headers?.AccessToken) {
            const user: AuthenticatedUser = await AuthenticatedUser.fromToken(event.headers?.AccessToken);
            cartRow.userId = await user.getUserId();
        } else {
            cartRow.userId = event.headers?.sessionId;
        }

        cartRow.userId = event.body?.customerId;
        cartRow.productId = event.body?.productId;
        cartRow.quantity = event.body?.quantity;
        response = Response.fromData<CartRow>(await addProductToCart(cartRow), StatusCodes.OK);
    } catch (error) {
        response = Response.fromError<CartRow>(error);
    }
    return response.toAPIGatewayProxyResult();
};

export const main = middyfy(addProductToCartHandler);
