


const { getTopics } = require("../controllers/topicsController");

const router = require('express').Router();

router.get('/', getTopics);

module.exports = router;










