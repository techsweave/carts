import 'source-map-support/register';

import Product from '@dbModel/tables/product';
import schema from '@functions/products/updateProduct/schema';
import updateProduct from '@products/updateProduct/function';
import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response, HttpStatusCodes } from 'utilities-techsweave';


/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is 'void' -> we have no body!
*/
const updateProductHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    let response: Response<Product>;
    try {
        const product = new Product();

        product.id = event.pathParameters?.id;
        product.name = event.body?.name;
        product.price = event.body?.price;
        product.description = event.body?.description;
        product.availability = event.body?.availability;
        product.discount = event.body?.discount;

        response = Response.fromData<Product>(
            await updateProduct(product),
            HttpStatusCodes.OK
        );
    }
    catch (error) {
        response = Response.fromError<Product>(error);
    }
    return response.toAPIGatewayProxyResult();
};

export const main = middyfy(updateProductHandler);
