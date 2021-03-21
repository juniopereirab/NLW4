import 'reflect-metadata';
import express from 'express';
import './database'; 

const app = express();

app.get('/', (req, res) => {
    return res.send("Hello World - NLW04");
});

app.listen(5050, () => {
    console.log("Server is running");
});