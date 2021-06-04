import dbContext from '@dbModel/dbContext';
import CartRow from '@dbModel/tables/cart';
import getCart from '@functions/getCart/function';

const removeProductFromCart = async (id: string): Promise<CartRow> => {
    await getCart(id);
    const item = new CartRow();
    item.id = id;
    return dbContext.delete(item);
};

export default removeProductFromCart;