import 'source-map-support/register';

import removeDeletedProductFromCart from './function';
import { ValidatedEventSQSEvent, middyfy } from 'utilities-techsweave';

const removeDeletedProductFromCartHandler: ValidatedEventSQSEvent<void> = async (event) => {
    try {
        await removeDeletedProductFromCart(event.Records[0].messageAttributes.productId.stringValue);
    } catch (error) {
        console.log(error);
    }

};

export const main = middyfy(removeDeletedProductFromCartHandler);