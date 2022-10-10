const db = require("../db/connection");

const fetchArticle = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid article_id query" });
  }
    return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows: articles }) => {
        if (articles.length < 1) {
            // 204 disgards body of response
        return Promise.reject({ status: 204, msg: "Article not found for article_id given" });
      }
      return articles[0];
    });
};

module.exports = {
  fetchArticle,
};
