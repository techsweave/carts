// import schema from './schema';
import { handlerPath } from 'utilities-techsweave';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'delete',
                path: 'cart/{id}',
                cors: true
            },
            authorizer: {
                name: 'ApiGatewayAuthorizer',
                arn: '${self:custom.cognitoArn}'
            }
        }
    ]
};