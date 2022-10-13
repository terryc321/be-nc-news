const { fetchArticles ,
        fetchArticle ,
        adjustArticle ,
        fetchComments ,
        putComment
      } = require("../models/articlesModel");

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


const getArticles = (req, res, next) => {
    const { topic } = req.query;   
    fetchArticles(topic).then((articles) => res.status(200).send({ articles }))
        .catch((err) => next(err));
};

const getComments = (req, res, next) => {
  const { article_id } = req.params;    
  fetchComments(article_id).then((comments) => res.status(200).send({ comments }))
        .catch((err) => next(err));
};

const postComment = (req, res, next) => {
    const { article_id } = req.params;
    putComment(article_id, req.body).then((comment) => res.status(201).send({ comment }))
        .catch((err) => next(err));
};


module.exports = {
    getArticles ,
    getArticle,
    patchArticle,
    getComments ,
    postComment
};
