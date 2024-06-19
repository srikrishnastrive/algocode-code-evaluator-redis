// import Docker from 'dockerode';

// import { TestCases } from '../types/testCases';
import CodeExecutorStrategy, { ExecutionResponse } from '../types/codeExecutorStatergy';
import { CPP_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';


class CppExecutor implements CodeExecutorStrategy{
    async execute(code: string, inputTestCase: string): Promise<ExecutionResponse> {
        const rawLogBuffer: Buffer[] = [];

        console.log("Initialising a new cpp docker container");
        await pullImage(CPP_IMAGE);
        const runCommand = `echo '${code}' > Main.cpp && g++ Main.cpp -o Main && echo '${inputTestCase}' | ./Main`;
    
        console.log(runCommand);
       
        const cppDockerContainer = await createContainer(CPP_IMAGE, [
            '/bin/sh', 
            '-c',
            runCommand
        ]); 
    
    
        // starting / booting the corresponding docker container
        await cppDockerContainer.start();
    
        console.log("Started the docker container");
    
        const loggerStream = await cppDockerContainer.logs({
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
            await cppDockerContainer.remove();

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

   

export default CppExecutor;