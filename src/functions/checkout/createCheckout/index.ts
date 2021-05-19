// import schema from './schema';
import { handlerPath } from 'utilities-techsweave';
import schema from '@functions/checkout/createCheckout/schema';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'post',
                path: 'checkout',
                cors: true,
                request: {
                    schemas: {
                        'application/json': schema
                    }
                }
            }
        }
    ]
};

