import 'source-map-support/register';

import CartRow from '@dbModel/tables/cart';
import removeProductFromCart from '@carts/removeProductFromCart/function';
import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response, HttpStatusCodes } from 'utilities-techsweave';

const removeProductFromCartHandler: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
    let response: Response<CartRow>;
    try {
        response = Response.fromData<CartRow>(await removeProductFromCart(event.pathParameters?.id), HttpStatusCodes.OK);
    } catch (error) {
        response = Response.fromError<CartRow>(error);
    }
    return response.toAPIGatewayProxyResult();
};

export const main = middyfy(removeProductFromCartHandler);