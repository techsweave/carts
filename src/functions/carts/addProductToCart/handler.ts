import 'source-map-support/register';

import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response } from 'utilities-techsweave';
import { StatusCodes } from 'http-status-codes';
import CartRow from '@dbModel/tables/cart';
import addProductToCart from '@carts/addProductToCart/function';
import schema from '@functions/carts/addProductToCart/schema';

const addProductToCartHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    let response: Response<CartRow>;
    try {
        const cartRow = new CartRow();
        //TODO change customer id with token from cognito
        cartRow.customerId = event.body?.customerId;
        cartRow.productId = event.body?.productId;
        cartRow.quantity = event.body?.quantity;
        response = Response.fromData<CartRow>(await addProductToCart(cartRow), StatusCodes.OK);
    } catch (error) {
        response = Response.fromError<CartRow>(error);
    }
    return response.toAPIGatewayProxyResult();
};

export const main = middyfy(addProductToCartHandler);
