const { createClient } = require('redis');
const { logger } = require('../logger');


const client = createClient({ url: process.env.REDIS_URL, no_ready_check: true })

module.exports = {
    client,
    configureRedisDb() {
        return new Promise((resolve, reject) => {
            client
                .connect()
                .then(() => {
                    logger.info("Redis has connected succesfully");
                    resolve();
                })
                .catch((err) => {
                    logger.error(err)
                    reject();
                })
        })
    }
}