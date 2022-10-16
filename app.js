

const express = require("express");
const app = express();

// const {handlePSQLErrors,
//        handleJSErrors,
//        handleServerErrors} = require('./errors/index.js');

const {handleErrors} = require('./errors/index.js');


const apiRouter = require('./routes/api-router');


app.use(express.json());

/*
app.use('/badSql',(req,res,next) => {
    
});
*/

app.use('/api', apiRouter);

// --- error handling code must come last ---
app.use(handleErrors);

// app.use(handleJSErrors);   
// app.use(handlePSQLErrors);  
// app.use(handleServerErrors);

module.exports = app;

