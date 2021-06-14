// import schema from './schema';
import { handlerPath } from 'utilities-techsweave';
import schema from './schema';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'put',
                path: 'cart/{id}',
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