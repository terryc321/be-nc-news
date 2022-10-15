const { fetchArticles ,
        fetchArticle ,
        adjustArticle ,
        fetchComments ,
        putComment ,
        removeComment,
        fetchApi        
      } = require("../models/articlesModel");

// ****
const getArticle = (req, res, next) => {
    const { article_id } = req.params;
    
    return fetchArticle(article_id)
        .then(article => res.status(200).send({ article}))             
        .catch(next);    
};



const patchArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    
    return adjustArticle(article_id,inc_votes)
        .then((article) => res.status(201).send({ article }))
        .catch(next);
    
};


const getArticles = (req, res, next) => {
    const { topic , sort_by , order } = req.query;    
    fetchArticles(topic, sort_by , order)
        .then(articles => res.status(200).send({ articles }))
        .catch(next);
};

const getComments = (req, res, next) => {
    const { article_id } = req.params;    
    fetchComments(article_id)
        .then(comments => res.status(200).send({ comments }))
        .catch(next);
};

const postComment = (req, res, next) => {
    const { article_id } = req.params;
    putComment(article_id, req.body)
        .then(comment => res.status(201).send({ comment }))
        .catch(err => next(err));
};

const deleteComment = (req, res, next) => {
    const { comment_id } = req.params;    
    removeComment(comment_id)
        .then(comment =>  res.status(204).send({comment}))
        .catch(err => next(err));
};

const getApi = (req, res, next) => {
    fetchApi()
        .then(msg =>  res.status(200).send({msg}))
        .catch(next);
};

module.exports = {
    getArticles ,
    getArticle,
    patchArticle,
    getComments ,
    postComment ,
    deleteComment,
    getApi
};
