import { Job } from "bullmq";

import runCpp from "../containers/runCpp";
import { IJob } from "../types/bullMqJobDefinition";
import { SubmissionPayload } from "../types/submissionPayload";

export default class SubmissionJob implements IJob{
    name:string;
    payload: Record<string, SubmissionPayload>;
    //constructor creates the object for the sampleJob
    constructor(payload : Record<string,SubmissionPayload>){
        this.payload = payload;
        this.name = this.constructor.name;
    
    }
    handle =async (job?:Job) => {
        console.log("Handler of the job called");
        console.log(this.payload);
        if(job){
            const key = Object.keys(this.payload)[0];
            if(this.payload[key].language === 'CPP'){
                const response = await runCpp(this.payload[key].code,this.payload[key].inputCase);
                console.log("Evaluated response is",response);
            }
        }
    };
    failed = (job?: Job) : void =>{
        console.log("job failed",job?.id);
        if(job){
            console.log(job.id);
        }
    };
}