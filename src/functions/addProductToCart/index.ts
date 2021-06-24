// import schema from './schema';
import { handlerPath } from 'utilities-techsweave';
import schema from './schema';

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
                },
                authorizer: {
                    name: 'ApiGatewayAuthorizer',
                    arn: '${self:custom.cognitoArn}'
                }
            }
        }
    ]
};