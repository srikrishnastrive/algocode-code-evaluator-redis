// import Docker from 'dockerode';

// import { TestCases } from '../types/testCases';
import { CPP_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';


async function runCpp(code: string, inputTestCase: string) {

    const rawLogBuffer: Buffer[] = [];

    console.log("Initialising a new java docker container");
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

    await new Promise((res) => {
        loggerStream.on('end', () => {
            console.log(rawLogBuffer);
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            console.log(decodedStream.stdout);
            res(decodeDockerStream);
        });
    });
    
    // remove the container when done with it
    await cppDockerContainer.remove();

}       

export default runCpp;