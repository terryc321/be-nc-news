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

const adjustArticle = (article_id, inc_votes) => {
    if(inc_votes === undefined){
        return Promise.reject({status : 400 , msg : "patch request requires 'inc_votes' json to be defined"});
    }
  return db
    .query(
      `UPDATE articles
       SET votes = votes + $2
       WHERE article_id = $1
       RETURNING *;`,
        [article_id , inc_votes]
    )
    .then(({ rows }) => {
      return rows[0];
    }).catch((err) => {
        return Promise.reject(err);
    });
};


module.exports = {
  fetchArticle, adjustArticle
};
