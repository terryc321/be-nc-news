const express = require("express");

//-------------------------------------------------------
const { getTopics } = require("./controllers/topicsController");

const { getArticles,
        getArticle ,
        patchArticle,
        getComments,
        postComment,
        deleteComment,
        getApi,
      } = require("./controllers/articlesController");

const { getUsers ,
        getUser} = require("./controllers/usersController");

const { patchComment ,
      getComment } = require("./controllers/commentsController");
// --------------------------------------------------------

const app = express();
app.use(express.json());

const apiRouter = require('./routes/api-router');
app.use('/api', apiRouter);

// app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticle);
app.patch("/api/articles/:article_id" , patchArticle);
app.get("/api/users", getUsers);
app.get("/api/users/:username", getUser);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postComment);
app.get("/api/comments/:comment_id", getComment);
app.delete("/api/comments/:comment_id", deleteComment);
app.patch("/api/comments/:comment_id",patchComment);

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

