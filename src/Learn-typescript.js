"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = express_1.default();
var add = function (a, b) {
    if (b) {
        // @ts-ignore
        return a + b;
    }
    else
        return 0;
};
var add2 = function (x) {
    return x.a + x.b;
};
app.get('/', function (req) {
    add2({ a: 1, b: 2 });
    req.name = 'bob';
    console.log(req.name);
});
app.listen(3001, function () {
    console.log("started");
});
console.log("hello from nigfa lmao");
