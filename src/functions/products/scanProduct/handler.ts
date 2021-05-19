import 'source-map-support/register';

import Product from '@dbModel/tables/product';
import scanProduct from '@products/scanProduct/function';

import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response } from 'utilities-techsweave';
import StatusCodes from 'http-status-codes';

import schema from '@functions/products/scanProduct/schema';


/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is type of 'Product'
*/
const scanProductHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    let res: Response<Product> = new Response<Product>();

    try {
        const result = await scanProduct(event.body);
        res = Response.fromMultipleData(result.items, StatusCodes.OK, result.lastKey);

    } catch (error) {
        res = Response.fromError<Product>(error);
    }
    return res.toAPIGatewayProxyResult();
};

export const main = middyfy(scanProductHandler);
