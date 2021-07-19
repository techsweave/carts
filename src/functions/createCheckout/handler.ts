import 'source-map-support/register';

import { ValidatedEventAPIGatewayProxyEvent, middyfy, Response, AuthenticatedUser } from 'utilities-techsweave';
import { StatusCodes } from 'http-status-codes';
import createCheckout from './function';
import schema from './schema';
import Stripe from 'stripe';

const createCheckoutHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    let res: Response<Stripe.Response<Stripe.Checkout.Session>>;

    try {

        let userId: string;
        if (event.headers?.accesstoken) {
            const user: AuthenticatedUser = await AuthenticatedUser.fromToken(event.headers?.accesstoken);
            userId = await user.getUserId();
        } else {
            userId = event.headers?.sessionId;
        }

        const session = await createCheckout(userId, event.body?.successUrl, event.body?.cancelUrl, event.headers?.accesstoken, event.headers?.idtoken);
        res = await Response.fromData<Stripe.Response<Stripe.Checkout.Session>>(session, StatusCodes.OK);
    }
    catch (error) {
        res = await Response.fromError<Stripe.Response<Stripe.Checkout.Session>>(error);
    }
    return res.toAPIGatewayProxyResult();
};

export const main = middyfy(createCheckoutHandler);
