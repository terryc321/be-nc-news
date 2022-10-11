const { fetchArticle , adjustArticle } = require("../models/articlesModel");

const getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => res.status(200).send({ article }))
        .catch((err) => next(err));
};

const patchArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    
    adjustArticle( article_id , inc_votes).then(
        article =>  res.status(201).send({article })
    ).catch(next);
};


module.exports = {
  getArticle, patchArticle
};
