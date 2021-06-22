import CartRow from '@dbModel/tables/cart';
import removeProductFromCart from '@functions/removeProductFromCart/function';
import dbContext from '@dbModel/dbContext';
import * as AWS from 'aws-sdk';
const removeDeletedProductFromCart = async (id: string): Promise<CartRow> => {

    const paginator = await dbContext.scan(CartRow, { filter: { type: 'Equals', subject: 'productId', object: id } }).pages();

    const cognito = new AWS.CognitoIdentityServiceProvider();
    let userAttributes: AWS.CognitoIdentityServiceProvider.AttributeListType;
    let usersEmail: Array<string>;

    for await (const page of paginator) {
        for await (const item of page) {
            item.isChanged = true;
            await dbContext.delete(item.id);

            userAttributes = await (await cognito.adminGetUser({ Username: item.userId, UserPoolId: process.env.USER_POOL_ID }).promise()).UserAttributes;
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
    userAttributes.forEach(item => {
        if (item.Name == 'email')
            usersEmail.push(item.Value);
    });

    const ses = new AWS.SES();
    const params: AWS.SES.SendEmailRequest = {
        Destination: {
            BccAddresses: usersEmail
        },
        Message: {
            Body: { Text: { Data: 'A product in your cart has been removed, be careful when starting a new checkout!' } },
            Subject: { Data: 'Your cart has changed' },
        },
        Source: 'no.reply.techsweave@gmail.com',
    };
    await ses.sendEmail(params).promise();

    return removeProductFromCart(id);
};

export default removeDeletedProductFromCart;