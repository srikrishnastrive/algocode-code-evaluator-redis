import express, { Express } from "express";

import serverConfig from "./config/serverConfig";
import serverAdapter from "./dashboard/bullmq.dashboard";
import sampleQueueproducer from "./producers/sampleQueueproducer";
import apiRouter from "./routes";
import SampleWorker from "./workers/sampleWorker";

const app: Express = express();

app.use('/api', apiRouter);
app.use("/admin", serverAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
  console.log(`Server started at *:${serverConfig.PORT}`);

  SampleWorker('SampleQueue');
  sampleQueueproducer('SampleJob',{
    name:"Sanketh",
    company:"Microsoft",
    position:"Sde 2 L61",
    location:"Remote noida"
  },1);

  sampleQueueproducer('SampleJob',{
    name:"srikrishna",
    company:"ibentos",
    position:"Sde 1 L61",
    location:"Remote "
  },2);

  
});
