import evaluationQueue from "../queues/evaluationQueue";

export default async function(payload:Record<string,unknown>)  {
    
    await evaluationQueue.add('EvaluatorJob',payload,);
    console.log("successfully added new evaluation  job");
}