import dbContext from '@dbModel/dbContext';
import CartRow from '@dbModel/tables/cart';
import getCart from '@functions/getCart/function';

const editCart = async (item: CartRow): Promise<CartRow> => {
    const oldItem = await dbContext.get(item);

    if (item.quantity <= 0)
        return dbContext.delete(item);

    oldItem.quantity = item.quantity;
    return dbContext.update(oldItem, { onMissing: 'skip' });
};

export default editCart;