import bodyParser from "body-parser";
import express, { Express } from "express";

import serverConfig from "./config/serverConfig";
import runCpp from "./containers/runCpp";
//import runJava from "./containers/runJavaDocker";
//import runPython from "./containers/runPythonDocker";
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
  console.log(`BullBoard dashboard running on: http://localhost:${serverConfig.PORT}/ui`);

  //const pythonCode = `x = input(); y = input(); print("value of x is", x); print("value of y is", y);`;
  // const javaCode = `
  // import java.util.Scanner;
  // public class Main {
  //     public static void main(String[] args) {
  //         Scanner scn = new Scanner(System.in);
  //         int input = scn.nextInt();
  //         System.out.println("input value given by user:" + input);
  //         for (int i = 0; i < input; i++){
  //           System.out.println(i);
  //         }
  //     }
  // }
  // `;

  // const cppCode = 
  // `#include <iostream>
  // using namespace std;
  
  // int main() {
  //     int input;
  //     cin >> input;
  //     cout << "input value given by user:" << input << endl;
  //     for (int i = 0; i < input; i++) {
  //         cout << i << endl;
  //     }
  //     return 0;
  // }
  // `;
  // const inputCase = `10`;
  const userCode = `
  
    class Solution {
      public:
      vector<int> permute() {
          vector<int> v;
          v.push_back(10);
          return v;
      }
    };
  `;

  const cppCode = `
  #include<iostream>
  #include<vector>
  #include<stdio.h>
  using namespace std;
  
  ${userCode}

  int main() {

    Solution s;
    vector<int> result = s.permute();
    for(int x : result) {
      cout<<x<<" ";
    }
    cout<<endl;
    return 0;
  }
  `;

const inputCase = `10
`;
  // runPython(pythonCode, inputCase);
  //runJava(javaCode,inputCase);
  runCpp(cppCode,inputCase);
  
});
