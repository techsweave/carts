// import schema from './schema';
import { handlerPath } from 'utilities-techsweave';
import schema from '@functions/products/scanProduct/schema';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'post',
                path: 'products/filter',
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

