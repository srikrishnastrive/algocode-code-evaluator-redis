import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { ExpressAdapter } from "@bull-board/express";
import { Queue, RedisOptions } from "bullmq"; 


const redisOptions: RedisOptions = {
  host: 'localhost',
  port: 6379,
};

const backupQueue = new Queue("SampleQueue", { connection: redisOptions }); // Pass redisOptions instead of RedisConnection

const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullMQAdapter(backupQueue)],
  serverAdapter: serverAdapter,
});

serverAdapter.setBasePath("/admin");

export default serverAdapter;


