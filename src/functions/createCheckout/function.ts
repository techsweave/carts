import getCart from '@functions/getCart/function';
import Stripe from 'stripe';
import { Models, Services } from 'utilities-techsweave';
import { ConditionExpression } from '@aws/dynamodb-expressions';
import * as AWS from 'aws-sdk';

const createCheckout = async (id: string, successUrl: string, cancelUrl: string, accessToken: string, idToken: string): Promise<Stripe.Response<Stripe.Checkout.Session>> => {

    const cart = await getCart(id);
    const productsId: Array<string> = [];

    cart.items.forEach(row => {
        productsId.push(row.productId);
    });

    const productFilter: ConditionExpression = {
        type: 'Membership',
        subject: 'id',
        values: productsId
    };

    const productsService = new Services.Products('vyx7o27url', process.env.REGION, process.env.STAGE, accessToken, idToken);
    let products: Models.Tables.IProduct[] = new Array<Models.Tables.IProduct>();
    const productsResult = await productsService.scanAsync(cart.items.length + 1, undefined, undefined, undefined, productFilter);
    products = products.concat(productsResult.count ? productsResult.data : productsResult as any);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

    const mergedCartProducts = cart.items.map(subject => {
        const otherSubject = products.find(element => element.id === subject.productId);
        return { ...subject, ...otherSubject };
    });


    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const row of mergedCartProducts) {
        lineItems.push({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: row.title,
                    description: row.description,
                },
                unit_amount: row.price * 100, // eur to cent conversion
            },
            quantity: row.quantity
        });
    }

    const session = await stripe.checkout.sessions.create({
        success_url: successUrl,
        cancel_url: cancelUrl,
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        metadata: {
            accessToken_1: accessToken.substr(0, 400),
            accessToken_2: accessToken.substr(400, 400),
            accessToken_3: accessToken.substr(800, 400),
            idToken_1: idToken.substr(0, 400),
            idToken_2: idToken.substr(400, 400),
            idToken_3: idToken.substr(800, 400),

        }
    });

    const arr = [];
    mergedCartProducts.forEach(item => {
        arr.push({
            productId: item.productId,
            price: item.price,
            quantity: item.quantity
        });
    });
    const messageAttributes: AWS.SNS.MessageAttributeMap = {
        products: {
            DataType: 'String',
            StringValue: JSON.stringify(arr)
        },
        accesstoken: {
            DataType: 'String',
            StringValue: accessToken
        }
    };

    const sns = new AWS.SNS();
    const params: AWS.SNS.PublishInput = {
        Message: 'createNewOrder',
        TopicArn: 'arn:aws:sns:eu-central-1:780844780884:createOrder',
        MessageAttributes: messageAttributes
    };

    await sns.publish(params).promise();

    return session;
};

export default createCheckout;