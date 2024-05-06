import bodyParser from "body-parser";
import express, { Express } from "express";

import serverConfig from "./config/serverConfig";
import serverAdapter from "./dashboard/bullmq.dashboard";
import apiRouter from "./routes";
import SampleWorker from "./workers/sampleWorker";

const app: Express = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use('/api', apiRouter);
app.use("/admin", serverAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
  console.log(`Server started at *:${serverConfig.PORT}`);

  SampleWorker('SampleQueue');
  
  
});
