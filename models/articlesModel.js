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

                   // default 
const fetchArticles = (topic = "") => {

    // endpoint is ["/api/articles"]
    // endpoint is ["/api/articles?topic=asdfko34km4o34r"]
    
    // no article_id given 
    
    // if mis-spell topic same as topic="" the query parameter mis-spelled ignored
    
    // sql injection - strip any characters not alphabetic or numbers
    var safer_topic = topic.replace(/[^a-z0-9]/gi, '');

    // problems with using LIKE '%$1%' was not working
    // so make it easier just use
    // string literal  `....${}...`

    // no pr requests today
    // next pr request will be thursday 9 am

    // 8 -
    //     9- done
    //         10 - done  no testing ...
    //              onto 11
    // 

    //  `....'
    
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
       });
};


module.exports = {
    fetchArticles , fetchArticle, adjustArticle
};
