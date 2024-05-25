import { Job, Worker } from "bullmq";

import redisConnection from "../config/redisConfig";
import SubmissionJob from "../jobs/SubmissionJob";

export default function SubmissionWorker(queueName: string) {

    new Worker(
        queueName,
        async (job: Job) => {
            // console.log("Sample job worker kicking",job);
            if (job.name === "SubmissionJob") {
                const submissoinJobInstance = new SubmissionJob(job.data);
                submissoinJobInstance.handle(job); 
                return true;
                
            } else { 
                throw new Error("Unknown job type");
            }
        },{
            connection:redisConnection
        }
        
    );
}
