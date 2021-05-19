// import schema from './schema';
import { handlerPath } from 'utilities-techsweave';
import schema from '@functions/carts/addProductToCart/schema';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'post',
                path: 'cart',
                cors: true,
                request: {
                    schema: {
                        'application/json': schema
                    }
                }
            }
        }
    ]
};