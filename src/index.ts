import express, { Express } from "express";

import serverConfig from "./config/serverConfig";
import sampleQueueproducer from "./producers/sampleQueueproducer";
import apiRouter from "./routes";
import SampleWorker from "./workers/sampleWorker";



const app: Express = express();

app.use('/api', apiRouter);

app.listen(serverConfig.PORT, () => {
  console.log(`Server started at *:${serverConfig.PORT}`);

  SampleWorker('SampleQueue');
  sampleQueueproducer('SampleJob',{
    name:"Sanketh",
    company:"Microsoft",
    position:"Sde 2 l61",
    location:"Remote noida"
  });

  
});
