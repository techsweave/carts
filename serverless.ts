import type { AWS } from '@serverless/typescript';

import {
    addProductToCart,
    editCart,
    getCart,
    removeProductFromCart,
    createCheckout,
    deleteCart,
    updateCartOnChangedProduct,
    removeDeletedProductFromCart
} from '@functions/index';

const serverlessConfiguration: AWS = {
    service: 'carts-service',

    frameworkVersion: '2',

    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        stage: 'dev',
        region: 'eu-central-1',
        lambdaHashingVersion: '20201221',

        apiGateway: {
            shouldStartNameWithService: true,
            minimumCompressionSize: 1024,
        },

        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            REGION: '${self:provider.region}',
            STAGE: '${self:provider.stage}',
            QUEUE: '${self:custom.queue}',
            S3ARN: '${self:custom.s3arn}',
            CARTS_TABLE: '${self:custom.cartsTable}',
            USER_POOL_ID: '${self:custom.userPoolId}',
            STRIPE_SECRET_KEY: '${self:custom.stripeSecretKey}',

        },

        iam: {
            role: {
                statements: [
                    {
                        Effect: 'Allow',
                        Action: [
                            'dynamodb:*',
                            'sns:*',
                            'sqs:*'
                        ],
                        Resource: ['*']
                    }
                ]
            }
        }
    },

    custom: {
        region: '${opt:region, self:provider.region}',
        stage: '${opt:stage, self:provider.stage}',
        queue: 'https://sqs.eu-central-1.amazonaws.com/780844780884/messagesQueue',
        s3arn: 'arn:aws:sns:eu-central-1:780844780884:images',
        cartsTable: 'carts-table',
        userPoolId: 'eu-central-1_eciEUvwzp',
        stripeSecretKey: 'sk_test_51Ij41SF20K2KHUILxXq9l5A2CbPS6VtYNmH4Ij0PPZyxatNDMTyovfiFjdYtOaQvbrDCokLPhorse1BxVPNXt1jW0032wODV69',
        dynamodb: {
            stages: ['dev'],
            start: {
                port: 8008,
                inMemory: true,
                migrate: true,
                seed: true,
                convertEmptyValues: true,
                // Uncomment only if you already have a DynamoDB running locally
                // noStart: true
            },
            migration: {
                dir: 'offline/migrations',
            },
        },
        webpack: {
            includeModules: true,
        },
    },

    package: {
        individually: true,
    },

    plugins: [
        'serverless-webpack',
        'serverless-offline',
        'serverless-dynamodb-local',
        'serverless-export-env'
    ],


    // import the function via paths
    functions: {
        addProductToCart,
        editCart,
        getCart,
        removeProductFromCart,
        createCheckout,
        deleteCart,
        updateCartOnChangedProduct,
        removeDeletedProductFromCart
    },

};

module.exports = serverlessConfiguration;


