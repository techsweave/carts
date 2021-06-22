import {
    attribute,
    autoGeneratedHashKey,
    table,
} from '@aws/dynamodb-data-mapper-annotations';
import { Models } from 'utilities-techsweave';

/*
 * This class represent a cart item in carts table
 */
@table(process.env.CARTS_TABLE)
class CartRow implements Models.Tables.ICart {
    @autoGeneratedHashKey()
    id: string;

    //TODO
    @attribute()
    productId: string;
    
    @attribute()
    userId: string;

    @attribute()
    quantity: number;

    @attribute()
    totalPrice: number;

    @attribute()
    isChanged: boolean;
}

export default CartRow;