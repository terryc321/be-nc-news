const express = require("express");

const { getTopics } = require("./controllers/topicsController");

const { getArticle } = require("./controllers/articlesController");

const { getUsers } = require("./controllers/usersController");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
      res.status(400).send({ msg : 'Invalid id' });
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
  res.status(500).send({ err: err.msg });
});

module.exports = app;

