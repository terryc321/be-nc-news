const { fetchArticles ,
        fetchArticle ,
        adjustArticle ,
        fetchComments ,
        putComment ,
        removeComment
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
    const { topic , sort_by , order } = req.query;
    // console.log(`getArticles topic = ${topic}`);
    // console.log(`getArticles sort_by = ${sort_by}`);
    // console.log(`getArticles order = ${order}`);
    
    fetchArticles(topic, sort_by , order).then((articles) => res.status(200).send({ articles }))
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

const deleteComment = (req, res, next) => {
    const { comment_id } = req.params;    
    removeComment(comment_id).then(
        comment =>  res.status(204).send({comment})
    ).catch(err => next(err));
};


module.exports = {
    getArticles ,
    getArticle,
    patchArticle,
    getComments ,
    postComment ,
    deleteComment
};
