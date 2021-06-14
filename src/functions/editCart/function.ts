import dbContext from '@dbModel/dbContext';
import CartRow from '@dbModel/tables/cart';
import getCart from '@functions/getCart/function';

const editCart = async (item: CartRow): Promise<CartRow> => {
    await getCart(item.id);
    return dbContext.update(item, { onMissing: 'skip' });
};

export default editCart;