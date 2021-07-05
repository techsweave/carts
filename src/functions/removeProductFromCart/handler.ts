import 'source-map-support/register';

import CartRow from '@dbModel/tables/cart';
import removeProductFromCart from './function';
import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response } from 'utilities-techsweave';

import { StatusCodes } from 'http-status-codes';

const removeProductFromCartHandler: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
    let response: Response<CartRow>;
    try {
        response = await Response.fromData<CartRow>(await removeProductFromCart(event.pathParameters?.id), StatusCodes.OK);
    } catch (error) {
        response = await Response.fromError<CartRow>(error);
    }
    return response.toAPIGatewayProxyResult();
};

export const main = middyfy(removeProductFromCartHandler);