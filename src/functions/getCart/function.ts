import dbContext from '@dbModel/dbContext';
import CartRow from '@dbModel/tables/cart';

const getCart = async (userId: string): Promise<{
    items: CartRow[],
    lastKey: Partial<CartRow>
}> => {
    let items: CartRow[] = [];
    let lastKey: Partial<CartRow>;

    const paginator = dbContext.scan(CartRow, {
        filter: {
            type: 'Equals',
            subject: 'userId',
            object: userId
        }
    }).pages();

    for await (const page of paginator) {
        items = items.concat(page);
        lastKey = paginator.lastEvaluatedKey;
    }

    return Promise.resolve({
        items: items,
        lastKey: lastKey
    });
};

export default getCart;