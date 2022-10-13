const db = require("../db/connection");

const fetchArticle = (article_id) => {
  return db
    .query(`SELECT articles.article_id  ,
       articles.author ,
       articles.title ,
       articles.body ,
       articles.topic ,
       articles.created_at ,
       articles.votes ,
       CAST(COUNT(comments.article_id) AS INT) AS comment_count 
       FROM comments RIGHT JOIN articles
       ON comments.article_id = articles.article_id
       WHERE articles.article_id = $1
       GROUP BY articles.article_id;`, [article_id])
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

const fetchArticles = (topic = "") => {

    // sanitize topic data
    const safer_topic = topic.replace(/[^a-z0-9]/gi, '');

    return db.query(`SELECT articles.article_id  ,
       articles.author ,
       articles.title ,
       articles.topic ,
       articles.created_at ,
       articles.votes ,
       articles.body , 
       CAST(COUNT(comments.article_id) AS INT) AS comment_count 
       FROM comments RIGHT JOIN articles
       ON comments.article_id = articles.article_id
       WHERE articles.topic LIKE \'%${safer_topic}%\'
       GROUP BY articles.article_id
       ORDER BY articles.created_at DESC;`).then(({ rows: articles }) => {
        return articles;
       }).catch((err) => {
            return Promise.reject(err);
       });
};


const fetchComments = (article_id) => {
    if (article_id === undefined) {
        return Promise.reject({ status: 400, msg: "fetchComments request requires 'article_id' json to be defined" });
    }
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "'article_id' in /api/articles/:article_id/comments is expected to be a number" });
    }

    return db.query(`SELECT *               
                     FROM articles
                     WHERE article_id = $1;`, [article_id]).then(({ rows: articles }) => {
                         if (articles.length < 1) {
                             return Promise.reject({ status: 400, msg: `There is no article with 'article_id' of ${article_id} in /api/articles/:article_id/comments` });
                         }
                     }).then(() => {
        return db.query(`SELECT comment_id ,
                            votes ,
                            created_at ,
                            author ,
                            body                             
                     FROM comments
                     WHERE article_id = $1
                     ORDER BY created_at DESC;`,[article_id]).then(({ rows: comments }) => {
             return comments;
       }).catch((err) => {
            return Promise.reject(err);
       });
};


const sql_sanitize = (str = "") => {
    return str.replace(/[^a-z0-9 _-]/gi, '');
}


const putComment = (article_id, newComment) => {
    const { username, body } = newComment;
    return db.query(`INSERT INTO comments
                                   ( author , body , article_id)
                       VALUES ($1 , $2 , $3)
                       RETURNING *;`, [username, body, article_id]).then(({ rows }) => {
        return rows[0];
    }).catch((err) => {
        return Promise.reject(err);
    });
};



module.exports = {
    fetchArticles ,
    fetchArticle,
    adjustArticle ,
    fetchComments ,
    putComment
};
