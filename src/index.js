"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
//const spawn = require("child_process").spawn;
//const pythonProcess = spawn('python',["get-playlists.py", 'wiktortheboss']);
var app = express_1.default();
var PythonShell = require('python-shell').PythonShell;
var myPythonScriptPath = 'get-playlists.py';
var pyshell = new PythonShell(myPythonScriptPath);
pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
});
// end the input stream and allow the process to exit
pyshell.end(function (err) {
    if (err) {
        throw err;
    }
    ;
    console.log('finished');
});
// app.get('/', (req, res)=> {
//     console.log("Here")
//     res.send('hello world')
// //     pythonProcess.stdout.on('data', (data: any) => {
// //         res.send("**************")
// //         res.send(data);
// //     });
//  })
// app.listen(3001, () => {
//     console.log("started")
// })
// console.log("hello from nigfa lmao");
