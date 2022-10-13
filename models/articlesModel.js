const db = require("../db/connection");



const sql_sanitize = (str = "") => {
    return str.replace(/[^a-z0-9 _-]/gi, '');
}



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


 ///  /api/articles
const fetchArticles = (topic_In = "" , sort_In = "created_at" , order_In = "desc") => {

    // console.log("sort_In = " , sort_In);
    // console.log("order_In = " , order_In);
    
    const topic = sql_sanitize(topic_In);
    const sort_by  = sql_sanitize(sort_In).toLowerCase();
    const order = sql_sanitize(order_In).toLowerCase();

    // console.log("<<< we reached line 66 articlesModel.js ");
    // console.log("order = " , order);
    
    
    if (sort_by === "" || order === ""){
        
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
       WHERE articles.topic LIKE \'%${topic}%\'
       GROUP BY articles.article_id
       ORDER BY created_at DESC`).then(({ rows: articles }) => {
            return articles;
        }).catch((err) => {
            return Promise.reject(err);
        });
    }

    // console.log("<<< we reached line 90 articlesModel.js ");
    
    // const sort_by_choices = ['author','title','article_id','topic',
    //                          'created_at','votes','comment_count'];
    // if (!sort_by_choices.includes(sort_by)){
    //     return Promise.reject({ status: 400, msg: `sort_by query parameter should be one of ${sort_by_choices} in GET request to /api/articles` });        
    // }

    // const order_choices = ['asc','desc'];
    // if (!order_choices.includes(order)){
    //     return Promise.reject({ status: 400, msg: `order query parameter should be one of ${sort_by_choices} asc to mean ascending / desc to mean descending in GET request to /api/articles` });        
    // }
    
    const query = `SELECT articles.article_id  ,
       articles.author ,
       articles.title ,
       articles.topic ,
       articles.created_at ,
       articles.votes ,
       articles.body , 
       CAST(COUNT(comments.article_id) AS INT) AS comment_count 
       FROM comments RIGHT JOIN articles
       ON comments.article_id = articles.article_id
       WHERE articles.topic LIKE \'%${topic}%\'
       GROUP BY articles.article_id
       ORDER BY ${sort_by} ${order}  ; `;

    //`ORDER BY %${sort_by}% ${order};`

    // console.log("sort_by = " , sort_by);

    // if (sort_by === 'author'){
    //     console.log(`the query for authors : ${query}`);
    // }

    // console.log("<<< we reached line 123 articlesModel.js ");
    
    return db.query(query).then(({ rows: articles }) => {
        return articles;
       }).catch((err) => {
           console.log("err = " , err.toString());
            return Promise.reject(err);
       });

     // return db.query(`SELECT articles.article_id  ,
     //   articles.author ,
     //   articles.title ,
     //   articles.topic ,
     //   articles.created_at ,
     //   articles.votes ,
     //   articles.body , 
     //   CAST(COUNT(comments.article_id) AS INT) AS comment_count 
     //   FROM comments RIGHT JOIN articles
     //   ON comments.article_id = articles.article_id
     //   WHERE articles.topic LIKE \'%${topic}%\'
     //   GROUP BY articles.article_id
     //   ORDER BY \'%${sort_by}%\' \'${order}\';`).then(({ rows: articles }) => {
     //    return articles;
     //   }).catch((err) => {
     //        return Promise.reject(err);
     //   });
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
                     WHERE article_id = $1;`, [article_id]).then(
                         ({ rows: articles }) => {
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
                     ORDER BY created_at DESC;`, [article_id]).then(({ rows: comments }) => {
                                 return comments;
                             }).catch((err) => {
                                 return Promise.reject(err);
                             });
                             
                         }).catch((err) => {
                                 return Promise.reject(err);
                         });
}


const putComment = (article_id, newComment) => {
    if (article_id === undefined) {
        return Promise.reject({ status: 400, msg: `The ':article_id' is undefined in POST request to /api/articles/:article_id/comments` });
    }
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: `The ':article_id' should be a number in request POST /api/articles/:article_id/comments` });
    }
    
    const { username, body } = newComment;
    return db.query(`SELECT *               
                     FROM articles
                     WHERE article_id = $1;`, [article_id]).then(
        ({ rows: articles }) => {
            if (articles.length < 1) {
                return Promise.reject({ status: 400, msg: `There is no article with 'article_id' of ${article_id} in POST /api/articles/:article_id/comments` });
            }
        }).then(() => {
            return db.query(`INSERT INTO comments
                                   ( author , body , article_id)
                       VALUES ($1 , $2 , $3)
                       RETURNING *;`, [username, body, article_id]).then(({ rows }) => {
                return rows[0];
            }).catch((err) => {
                return Promise.reject(err);
            });
        });
};
                                

const removeComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then(({ rows: comments }) => {
      if (comments.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return comments[0];
      }
    }).catch((err) => {
        return Promise.reject(err);
    });
};




module.exports = {
    fetchArticles ,
    fetchArticle,
    adjustArticle ,
    fetchComments ,
    putComment,
    removeComment
};
