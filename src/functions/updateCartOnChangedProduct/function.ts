import dbContext from '@dbModel/dbContext';
import CartRow from '@dbModel/tables/cart';
import * as AWS from 'aws-sdk';

const updateCartOnChangedProduct = async (productId: string): Promise<void> => {
    const iterator = await dbContext.scan(CartRow, { filter: { type: 'Equals', subject: 'productId', object: productId } });

    const cognito = new AWS.CognitoIdentityServiceProvider();
    let userAttributes: AWS.CognitoIdentityServiceProvider.AttributeListType;
    let usersEmail: Array<string>;

    for await (const item of iterator) {
        item.isChanged = true;
        await dbContext.update(item, { onMissing: 'skip' });

        userAttributes = await (await cognito.adminGetUser({ Username: item.userId, UserPoolId: process.env.USER_POOL_ID }).promise()).UserAttributes;

        /*
        userAttributes: [
            {
                "Name": "AttributeName",
                "Value": "AttributeValue"
            },
            ...
        ]
        */

        userAttributes.forEach(item => {
            if (item.Name == 'email')
                usersEmail.push(item.Value);
        });


    }
    const ses = new AWS.SES();
    const params: AWS.SES.SendEmailRequest = {
        Destination: {
            BccAddresses: usersEmail
        },
        Message: {
            Body: { Text: { Data: 'A product in your cart has changed, be careful when starting a new checkout!' } },
            Subject: { Data: 'Your cart has changed' },
        },
        Source: 'no.reply.techsweave@gmail.com',
    };
    ses.sendEmail(params);

};
export default updateCartOnChangedProduct;