//importazione moduli swagger
const swaggerJsdoc = require('swagger-jsdoc'); //prende i commenti scritti nel codice
const swaggerUi = require('swagger-ui-express'); //visualizza il tutto in una interfaccia grafica nel browser

//Schemas
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API JP-Bank',
      version: '1.0.0',
    },
    components: {
        schemas: {
            NewAccount: {
                type: 'object',
                required: ['name','type'],
                properties: {
                    name: {type: 'string'},
                    type: {type: 'string', enum: ['current','deposit','investing']},
                    balance: {type: 'number'}
                }
            },
            Account: {
                type: 'object',
                properties: {
                    id: {type: 'integer'},
                    user_id: {type: 'integer'},
                    name: {type: 'string'},
                    balance: {type: 'number'},
                    type: {type: 'string', enum: ['current','deposit','investing']},
                    status: {type: 'string', enum: ['active','inactive']}
                }
            },
            NewUser: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                    name: {type: 'string'},
                    email: {type: 'string'},
                    password: {type: 'string'},
                    marketing: {type: 'boolean'}
                }
            },
            LoginUser: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: {type: 'string'},
                    password: {type: 'string'}
                }
            },
            TransferRequest: {
                type: 'object',
                required: ['senderAccountId', 'receiverAccountId', 'amount'],
                properties: {
                    senderAccountId: {type: 'integer'},
                    receiverAccountId: {type: 'integer'},
                    amount: {type: 'number'},
                    description: {type: 'string'}
                }
            },
            Transaction: {
                type: 'object',
                properties: {
                    id: {type: 'integer'},
                    sender_id: {type: 'integer'},
                    receiver_id: {type: 'integer'},
                    amount: {type: 'number'},
                    description: {type: 'string'},
                    timestamp: {type: 'string',format: 'date-time'}
                }
            },
            ErrorResponse:{
                type: 'object',
                properties:{
                    success: {type: 'boolean', example: false,},
                    error:{
                        type: 'object',
                        properties:{
                            message:{
                                type: 'string',
                                example: 'err.message || Errore interno del server'
                            }
                        }
                    }
                }
            }
        }
    }
  },
  apis: ['./routes/*.js'] //percorso contenente i file con commenti JSDoc, dai quali leggere le API
}
const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec}