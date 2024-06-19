import { Job } from "bullmq";


import { IJob } from "../types/bullMqJobDefinition";
import { SubmissionPayload } from "../types/submissionPayload";
import createExecutor from "../utils/executorFactory";
import { ExecutionResponse } from "../types/codeExecutorStatergy";


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
            const codeLanguage = this.payload[key].language;
            const code = this.payload[key].code;
            const inputTestCase = this.payload[key].inputCase;
            // const key = Object.keys(this.payload)[0];
            // if(this.payload[key].language === 'CPP'){
            //     const response = await runCpp(this.payload[key].code,this.payload[key].inputCase);
            //     console.log("Evaluated response is",response);
            // }
            const  strategy = createExecutor(codeLanguage); 
            if(strategy != null){
                const response : ExecutionResponse= await strategy.execute(code,inputTestCase);
                if(response.status === "COMPLETED"){
                    console.log('Code executed successfully');
                    console.log(response);
                }
                else {
                    console.log('Something went wrong with the code execution');
                    console.log(response);
                }


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