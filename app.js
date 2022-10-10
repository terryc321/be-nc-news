const express = require("express");

const { getTopics } = require("./controllers/topicsController");

const { getArticle } = require("./controllers/articlesController");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);


app.use((err, req, res, next) => {
  if (err.status) {
      res.status(err.status).send({ msg : err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ err: err.msg });
});

module.exports = app;

