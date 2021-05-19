// import schema from './schema';
import { handlerPath } from 'utilities-techsweave';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'products/{id}',
                cors: true
            }
        }
    ]
};

