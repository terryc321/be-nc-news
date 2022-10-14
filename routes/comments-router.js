
const { deleteComment,
      } = require("../controllers/articlesController");

const { patchComment ,
      getComment } = require("../controllers/commentsController");

const router = require('express').Router();

router.get('/:comment_id', getComment);
router.delete('/:comment_id', deleteComment);
router.patch('/:comment_id', patchComment);

module.exports = router;











