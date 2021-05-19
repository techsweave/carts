import 'source-map-support/register';

import { Response, HttpStatusCodes, middyfy, ValidatedEventAPIGatewayProxyEvent } from 'utilities-techsweave';
import Stripe from 'stripe';
import schema from '@functions/checkout/createCheckout/schema';
import createCheckout from '@checkout/createCheckout/function';

const createCheckoutHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    let res: Response<Stripe.Response<Stripe.Checkout.Session>>;
    try {
        const session = await createCheckout('customerDefault', event.body?.successUrl, event.body?.cancelUrl);

        res = Response.fromData<Stripe.Response<Stripe.Checkout.Session>>(session, HttpStatusCodes.OK);
    }
    catch (error) {
        res = Response.fromError<Stripe.Response<Stripe.Checkout.Session>>(error);
    }
    return res.toAPIGatewayProxyResult();

};

export const main = middyfy(createCheckoutHandler);