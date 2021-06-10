import dbContext from '@dbModel/dbContext';
import CartRow from '@dbModel/tables/cart';

const deleteCart = async (customerId: string): Promise<CartRow[]> => {
    // let items: CartRow[] = [];
    // let lastKey: Partial<CartRow>;

    const paginator = dbContext.scan(CartRow, {
        filter: {
            type: 'Equals',
            subject: 'customerId',
            object: customerId
        }
    }).pages();

    const tasks: Promise<CartRow>[] = [];
    for await (const page of paginator) {
        page.forEach(element => {
            tasks.push(dbContext.delete(element));
        });
    }

    return Promise.all(tasks);

};

export default deleteCart;