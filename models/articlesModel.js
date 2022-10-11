const db = require("../db/connection");

const fetchArticle = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows: articles }) => {
      if (articles.length < 1) {
        return Promise.reject({
          status: 404,
          msg: "Article not found for article_id given",
        });
      }
      return articles[0];
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

const fetchArticles = () => {
  return db.query("SELECT * FROM articles;").then(({ rows: articles }) => {
    return articles;
  });
};


module.exports = {
  fetchArticle, fetchArticles
};
