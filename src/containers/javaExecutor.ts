// import Docker from 'dockerode';

// import { TestCases } from '../types/testCases';
import CodeExecutorStrategy, { ExecutionResponse } from '../types/codeExecutorStatergy';
import { JAVA_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';


class JavaExecutor implements CodeExecutorStrategy{
    async execute(code: string, inputTestCase: string): Promise<ExecutionResponse> {
        const rawLogBuffer: Buffer[] = [];

    console.log("Initialising a new java docker container");
    pullImage(JAVA_IMAGE);
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
    console.log(runCommand);
    // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']); 
    const javaDockerContainer = await createContainer(JAVA_IMAGE, [
        '/bin/sh', 
        '-c',
        runCommand
    ]); 


    // starting / booting the corresponding docker container
    await javaDockerContainer.start();

    console.log("Started the docker container");

    const loggerStream = await javaDockerContainer.logs({
        stdout: true,
        stderr: true,
        timestamps: false,
        follow: true // whether the logs are streamed or returned as a string
    });
    
    // Attach events on the stream objects to start and stop reading
    loggerStream.on('data', (chunk) => {
        rawLogBuffer.push(chunk);
    });

    
    try{
        const codeResponse:string = await this.fetchDecodedStream(loggerStream,rawLogBuffer);
            return {output:codeResponse,status:"COMPLETED"};
    }
    catch(error){
        return {output: error as string, status:"ERROR"};
    }
    finally{
        await javaDockerContainer.remove();

    }
    

        
    }

    fetchDecodedStream(loggerStream: NodeJS.ReadableStream,rawLogBuffer:Buffer[]):Promise<string>{
        return new Promise((res,rej) => {
            loggerStream.on('end', () => {
                console.log(rawLogBuffer);
                const completeBuffer = Buffer.concat(rawLogBuffer);
                const decodedStream = decodeDockerStream(completeBuffer);
                console.log(decodedStream);
                console.log(decodedStream.stdout);
                // res(decodeDockerStream);
                if(decodedStream.stderr){
                    rej(decodedStream.stderr);
                }
                else {
                    res(decodedStream.stdout);
                }
            });
        });
    }
    
}


export default JavaExecutor;