import getCart from '@functions/getCart/function';
import Stripe from 'stripe';
import { Models, Services } from 'utilities-techsweave';
import { ConditionExpression } from '@aws/dynamodb-expressions';

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
    products = products.concat((await productsService.scanAsync(cart.items.length + 1, undefined, undefined, undefined, productFilter)).data);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

    const mergedCartProducts = cart.items.map(subject => {
        const otherSubject = products.find(element => element.id === subject.productId);
        return { ...subject, ...otherSubject };
    });

    //const mergedCartProducts = [];

    // for await (const iterator of cart.items) {
    //     mergedCartProducts.push(await productsService.getAsync(iterator.id));
    // }

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
        mode: 'payment'
    });

    return session;
};

export default createCheckout;