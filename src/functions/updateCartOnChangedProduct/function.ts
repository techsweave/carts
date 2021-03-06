import dbContext from '@dbModel/dbContext';
import CartRow from '@dbModel/tables/cart';
import * as AWS from 'aws-sdk';

const updateCartOnChangedProduct = async (productId: string): Promise<void> => {

    const paginator = dbContext.scan(CartRow, {
        filter: {
            type: 'Equals',
            subject: 'productId',
            object: productId
        }
    }).pages();
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const usersAttributes: Array<AWS.CognitoIdentityServiceProvider.AttributeListType> = [];
    const usersEmail: Array<string> = [];

    for await (const page of paginator) {
        for (const item of page) {
            item.isChanged = true;
            await dbContext.update(item, { onMissing: 'skip' });
            usersAttributes.push(await (await cognito.adminGetUser({ Username: item.userId, UserPoolId: process.env.USER_POOL_ID }).promise()).UserAttributes);
        }
    }


    /*
    userAttributes: [
        {
            "Name": "AttributeName",
            "Value": "AttributeValue"
        },
        ...
    ]
    */


    usersAttributes.forEach(userAttributes => {
        usersEmail.push(userAttributes.find(item => item.Name == 'email').Value);
    });


    const ses = new AWS.SES({ region: 'eu-west-1' });
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
    await ses.sendEmail(params).promise();

};
export default updateCartOnChangedProduct;