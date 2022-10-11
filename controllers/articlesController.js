const { fetchArticle , fetchArticles } = require("../models/articlesModel");

const getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => res.status(200).send({ article }))
        .catch((err) => next(err));
};

const getArticles = (req, res, next) => {
  fetchArticles().then((articles) => res.status(200).send({ articles }))
        .catch((err) => next(err));
};



module.exports = {
  getArticle, getArticles
};
