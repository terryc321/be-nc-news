const express = require("express");

const app = express();
app.use(express.json());

const apiRouter = require('./routes/api-router');
app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
      res.status(400).send({ msg : err.toString() });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
      res.status(err.status).send({ msg : err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
    console.log("error = " , err.toString());
    console.log("error = " , err);
    
  res.status(500).send({ err: err.msg });
});

module.exports = app;

