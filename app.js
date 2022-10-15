const express = require("express");
const app = express();

const {handlePSQLErrors,
       handleJSErrors,
       handleServerErrors} = require('./controllers/errorsController.js');

const apiRouter = require('./routes/api-router');


app.use(express.json());

app.use('/api', apiRouter);

app.use(handlePSQLErrors);
app.use(handleJSErrors);
app.use(handleServerErrors);

module.exports = app;

