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
        if (event.headers?.AccessToken) {
            const user: AuthenticatedUser = await AuthenticatedUser.fromToken(event.headers?.AccessToken);
            userId = await user.getUserId();
        } else {
            userId = event.headers?.sessionId;
        }
        const acc = event.headers?.AccessToken;
        const idT = event.headers?.IdToken;

        const session = await createCheckout(userId, event.body?.successUrl, event.body?.cancelUrl, acc, idT);
        res = Response.fromData<Stripe.Response<Stripe.Checkout.Session>>(session, StatusCodes.OK);
    }
    catch (error) {
        res = Response.fromError<Stripe.Response<Stripe.Checkout.Session>>(error);
    }
    return res.toAPIGatewayProxyResult();
};

export const main = middyfy(createCheckoutHandler);




//serverless invoke local --function createCheckout --data '{ "headers": { "AccessToken" : "eyJraWQiOiJWSVA1Tk5QTm1HZHVNR244Tlo5OVBTM2JzWWNlSXpiRmx6STJYVEFuSkJnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJkNmJkZWNjZC1jM2NhLTRkNWUtYTg0Zi0yODBiMjMwYzI1NjAiLCJldmVudF9pZCI6IjJmODI1YTM3LTIwOWEtNDhiNy1iMDgzLTY2NWUwZGIxNWFiMiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4gb3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE2MjMxNjM2OTUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS1jZW50cmFsLTEuYW1hem9uYXdzLmNvbVwvZXUtY2VudHJhbC0xX2VjaUVVdnd6cCIsImV4cCI6MTYyMzE2NzI5NSwiaWF0IjoxNjIzMTYzNjk1LCJ2ZXJzaW9uIjoyLCJqdGkiOiI0OTJiNThiNi03MmI5LTQzMWMtOTU5Yy1hMmFkZDI1YmU5MzgiLCJjbGllbnRfaWQiOiI3djA5ZGxkYTdyNXBqbmpjaXVsN2c4anJhaCIsInVzZXJuYW1lIjoidGVzdGN1c3RvbWVyIn0.buplMNT8XFk-dceRaxwL7RPPhv-jG50pk9PQ419Kc3tU1SSloRTzeR2HzjT3cEvXBrxJEzh0BiJcXKHq4zMbZmQr_-ISIa1cV2i8LT4IlA6msngRiLd9uCicoeLG70A9fgvbhkmhc77efNwobbXcU-cj4fdDVkOWLGTZqfyGb1EFCPg9C9mxO0vR_nC-CwtjkJMbqqoS8xMRzW7XSEwTNZsbn2HdXHO51yPbe30KE80eijRfAo1rtDDaduBwXO0vdcIQB8jQ68TE6sOgQYkkHLkq7zQ8p-dcWldq8zfdp8f5666X-Kwnrx6xQ2q2_rurx1p756nzEw0WXGkwFVUsEA", "IdToken": "eyJraWQiOiJiWENiOVF2cW9TWG1xaHBJanAyMHR6UkRBSDliT1dtZ200YjBQTDk0ekc0PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiLVhEY0trbTh4bEllQmlrTmg0OV8tZyIsInN1YiI6ImQ2YmRlY2NkLWMzY2EtNGQ1ZS1hODRmLTI4MGIyMzBjMjU2MCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiYWRkcmVzcyI6eyJmb3JtYXR0ZWQiOiJ2aWEgbHVpZ2kgMjUifSwiYmlydGhkYXRlIjoiMDJcLzEyXC8xOTI1IiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfZWNpRVV2d3pwIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6InRlc3RjdXN0b21lciIsImF1ZCI6Ijd2MDlkbGRhN3I1cGpuamNpdWw3ZzhqcmFoIiwiZXZlbnRfaWQiOiIyZjgyNWEzNy0yMDlhLTQ4YjctYjA4My02NjVlMGRiMTVhYjIiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTYyMzE2MzY5NSwibmFtZSI6IkN1c3RvbWVyIiwicGhvbmVfbnVtYmVyIjoiKzM5MzQ2MTIzNDU2NyIsImV4cCI6MTYyMzE2NzI5NSwiaWF0IjoxNjIzMTYzNjk1LCJmYW1pbHlfbmFtZSI6IlJvc3NpIiwiZW1haWwiOiJwYXhpa2U5NTgwQGptcGFudC5jb20ifQ.PRyW7pd2bBN9M7dBrmVSxfPbE0QJVmSeLohc8GgLXD3qX4KPsomuSk-dTmQmhTPUrkmswBc9bU04sWGdXQvRBmGwqx4OP3EJw2wR3Cd_UrZ1XKz3Sb0AGTyeBRd8YIjewqIvgVv93W9DsybIl06a3ShNuCAHknr21iWQTUMI4UpaAcbbgab03RhmA6tK_6T0ZKvwQSwtcUHm_gUC1hEGiSVMXudRgFwCaE81PwZ8gQpRB-w7PycgT3QioIQiSQU1snj1h7dvW5v8yPxItoPJPQ4yQXvNGletZsiA80jmwMyHNUwKBkxoWtQfABKptJzdyKkCnZmry4wBvm_lLsxUdw" }, "body": {"successUrl" : "https://eml-fe.vercel.app/success", "cancelUrl" : "https://eml-fe.vercel.app/home"} }'