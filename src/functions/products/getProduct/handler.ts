import 'source-map-support/register';

import Product from '@dbModel/tables/product';
import getProduct from '@products/getProduct/function';
import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response } from 'utilities-techsweave';
import { StatusCodes } from 'http-status-codes';

/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is 'void' -> we have no body!
*/
const getProductHandler: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
    let response: Response<Product>;
    try {
        response = Response.fromData<Product>(
            await getProduct(event.pathParameters?.id),
            StatusCodes.OK);
    }
    catch (error) {
        response = Response.fromError<Product>(error);
    }
    return response.toAPIGatewayProxyResult();
};

export const main = middyfy(getProductHandler);
