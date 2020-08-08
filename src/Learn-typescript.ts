

import express from 'express';

const app = express();

const add = (a:number,b?:number):number => {
    if(b){
        // @ts-ignore
        return a+b!;
    }
    else
        return 0;
}

const add2: Add=x => {
   return x.a+x.b;
}

type Add = (x: Params) =>number;

interface Params {
    a: number
    b: number
}

app.get('/', (req: any)=> {
    add2({a:1, b:2});
    (req as any).name = 'bob'
    console.log(req.name)
})

app.listen(3001, () => {
    console.log("started")
})

console.log("hello from nigfa lmao");