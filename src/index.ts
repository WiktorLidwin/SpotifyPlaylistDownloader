import express from 'express';

//const spawn = require("child_process").spawn;
//const pythonProcess = spawn('python',["get-playlists.py", 'wiktortheboss']);
const app = express();

let {PythonShell} = require('python-shell')
var myPythonScriptPath = 'get-playlists.py';
var pyshell = new PythonShell(myPythonScriptPath);

pyshell.on('message', function (message: any) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
});

// end the input stream and allow the process to exit
pyshell.end(function (err: any) {
    if (err){
        throw err;
    };

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