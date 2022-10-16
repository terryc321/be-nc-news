

const { getTopics } = require("../controllers/topicsController");

const { getArticles,
        getArticle ,
        patchArticle,
        getComments,
        postComment,
      } = require("../controllers/articlesController");

/*
const { getUsers ,
        getUser} = require("../controllers/usersController");

const { patchComment ,
      getComment } = require("../controllers/commentsController");
*/
const router = require('express').Router();

// *** GET /api/articles

router.get('/', getArticles); 
router.get('/:article_id', getArticle); 
router.patch('/:article_id', patchArticle); 
router.get('/:article_id/comments', getComments); 
router.post('/:article_id/comments', postComment); 

module.exports = router;











