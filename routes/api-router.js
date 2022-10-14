

const { getTopics } = require("../controllers/topicsController");

const { getArticles,
        getArticle ,
        patchArticle,
        getComments,
        postComment,
        deleteComment,
        getApi,
      } = require("../controllers/articlesController");

const { getUsers ,
        getUser} = require("../controllers/usersController");

const { patchComment ,
      getComment } = require("../controllers/commentsController");



// api-router.js
const apiRouter = require('express').Router();

// app.get("/api", getApi);
apiRouter.get('/', getApi);

module.exports = apiRouter;

