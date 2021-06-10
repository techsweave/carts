import 'source-map-support/register';

import deleteCart from './function';
import { ValidatedEventSQSEvent, middyfy, AuthenticatedUser } from 'utilities-techsweave';

/*
 * Remember: event.body type is the type of the instantiation of ValidatedEventAPIGatewayProxyEvent
 * In this case event.body type is type of 'Cart'
*/
const deleteCartHandler: ValidatedEventSQSEvent<void> = async (event) => {
    try {

        const user: AuthenticatedUser = await AuthenticatedUser.fromToken(event.Records[0]?.messageAttributes.AccessToken.stringValue);
        const userId = await user.getUserId();

        await deleteCart(userId);
        
    } catch (error) {
        console.log(error);
    }
};
export const main = middyfy(deleteCartHandler);