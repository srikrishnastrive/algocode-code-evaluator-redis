import Redis from "ioredis";

import ServerConfig from './serverConfig';

const redisConfig = {
    port:ServerConfig.REDIS_PORT, //6379
    host: ServerConfig.REDIS_HOST,//127.0.0.1
    maxRetriesPerRequest: null
}; 

const redisConnection = new Redis(redisConfig);

export default redisConnection;