export default {
    type: 'object',
    properties: {
        productId: { type: 'string' },
        quantity: { type: 'number' }
    },
    required: ['productId', 'quantity']
} as const;