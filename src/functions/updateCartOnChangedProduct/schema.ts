export default {
    type: 'object',
    properties: {
        productId: { type: 'string' }
    },
    required: ['productId']
} as const;