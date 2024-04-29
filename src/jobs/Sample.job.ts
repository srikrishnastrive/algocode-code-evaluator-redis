import { Job } from "bullmq";

import { IJob } from "../types/bullMqJobDefinition";

export class SampleJob implements IJob{
    name:string;
    payload: Record<string, unknown>;
    //constructor creates the object for the sampleJob
    constructor(payload : Record<string,unknown>){
        this.payload = payload;
        this.name = this.constructor.name;
    
    }
    handle = (job?:Job) => {
        console.log("Handler of the job called");
        console.log(this.payload);
        if(job){
            console.log(job.id);
        }
    };
    failed = (job?: Job) : void =>{
        console.log("job failed",job?.id);
        if(job){
            console.log(job.id);
        }
    };
}