import 'source-map-support/register';

import Product from '@dbModel/tables/product';
import schema from '@functions/products/createProduct/schema';
import createProduct from '@products/createProduct/function';
import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response, HttpStatusCodes } from 'utilities-techsweave';

/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is type of 'Product'
*/
const createProductHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    let res: Response<Product>;

    try {
        const putProduct: Product = new Product();

        putProduct.name = event.body.name;
        putProduct.price = event.body?.price;
        putProduct.description = event.body?.description;
        putProduct.availability = event.body?.availability;
        putProduct.discount = event.body?.discount;

        res = Response.fromData<Product>(await createProduct(putProduct), HttpStatusCodes.CREATED);

    } catch (error) {
        res = Response.fromError<Product>(error);
    }
    return res.toAPIGatewayProxyResult();
};

export const main = middyfy(createProductHandler);
