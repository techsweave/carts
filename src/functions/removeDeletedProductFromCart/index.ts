// import schema from './schema';
import { handlerPath } from 'utilities-techsweave';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            sqs: 'arn:aws:sqs:eu-central-1:780844780884:productInCartNotAvailable'
        }
    ]
};