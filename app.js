const express = require("express");

const { getTopics ,
      } = require("./controllers/topicsController");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);




app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ err });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ err: err.message });
});

module.exports = app;
