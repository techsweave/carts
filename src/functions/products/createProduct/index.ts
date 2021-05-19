// import schema from './schema';
import { handlerPath } from 'utilities-techsweave';
import schema from '@functions/products/createProduct/schema';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'post',
                path: 'products',
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

