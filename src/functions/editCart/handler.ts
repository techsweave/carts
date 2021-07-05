import 'source-map-support/register';

import CartRow from '@dbModel/tables/cart';
import editCart from './function';
import schema from './schema';
import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response } from 'utilities-techsweave';
import { StatusCodes } from 'http-status-codes';
const editCartHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    let response: Response<CartRow>;
    try {
        const cartRow = new CartRow();
        cartRow.id = event.pathParameters?.id;
        cartRow.quantity = event.body?.quantity;
        response = await Response.fromData<CartRow>(await editCart(cartRow), StatusCodes.OK);
    } catch (error) {
        response = await Response.fromError<CartRow>(error);
    }
    return response.toAPIGatewayProxyResult();
};

export const main = middyfy(editCartHandler);