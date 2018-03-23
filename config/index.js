module.exports = {
    development: {
        database: {
            url: 'postgres://wdwyogzyooqycm:ce5878abe136f63d6c7114b926d4654d5d8e2ce515b45cfa271e2c1a4b8cf784@ec2-54-204-45-43.compute-1.amazonaws.com:5432/dbi1ijv2pstot1'
        },
        security: {
            checkClientOnDev: false
        },
        server: {
            initialize: {
                base: '/api',
                updateMethod: 'PATCH'
            }
        }
    }
}
