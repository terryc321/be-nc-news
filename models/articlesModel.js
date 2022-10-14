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


const fetchArticles = (topic_In = "" , sort_In = "created_at" , order_In = "desc") => {
    
    const topic = sql_sanitize(topic_In);
    const sort_by  = sql_sanitize(sort_In).toLowerCase();
    const order = sql_sanitize(order_In).toLowerCase();
    
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

    const sort_by_choices = ['author','title','article_id','topic',
                             'created_at','votes','comment_count'];
    if (!sort_by_choices.includes(sort_by)){
        return Promise.reject({ status: 400, msg: `sort_by query parameter should be one of ${sort_by_choices} in GET request to /api/articles` });        
    }

    const order_choices = ['asc','desc'];
    if (!order_choices.includes(order)){
        return Promise.reject({ status: 400, msg: `order query parameter should be one of ${order_choices} asc to mean ascending / desc to mean descending in GET request to /api/articles` });        
    }
    
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
   
    return db.query(query).then(({ rows: articles }) => {
        return articles;
       }).catch((err) => {
           console.log("err = " , err.toString());
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
        return Promise.reject({ status: 400, msg: `The ':article_id' should be a number POST in request to /api/articles/:article_id/comments` });
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
    if (comment_id === undefined) {
        return Promise.reject({ status: 400, msg: `The ':comment_id' is undefined in DELETE request to /api/comments/:comment_id` });
    }
    if (isNaN(comment_id)) {
        return Promise.reject({ status: 400, msg: `The ':comment_id' should be a number in DELETE request /api/comments/:comment_id` });
    }
    return db.query(`SELECT *               
                     FROM comments
                     WHERE comment_id = $1;`, [comment_id]).then(
                         ({ rows: comments }) => {
                             
            if (comments.length < 1) {
                return Promise.reject({ status: 400, msg: `There is no comment with 'comment_id' of ${comment_id} in POST /api/comments/:comment_id` });
            }
        }).then(() => {
            return db
                .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
                    comment_id,
                ])
                .then(({ rows: comments }) => {
                    if (comments.length === 0) {
                        return Promise.reject({ status: 400, msg: "not found" });
                    } else {
                        return comments[0];
                    }
                }).catch((err) => {
                    return Promise.reject(err);
                });
        });
};

const fetchApi = () => {
  const api = [
    {
      http: "get",
      endpoint: "/api/topics",
      description: `Responds with: an array of topic objects, each of which should have the following properties: slug , description`,
    },
    { http: "get", endpoint: "/api/articles/:article_id", description: `Responds with:

an article object, which should have the following properties:

author which is the username from the users table
title
article_id
body
topic
created_at
votes` },
    { http: "get", endpoint: "/api/users", description: `Responds with:

an array of objects, each object should have the following property:
username
name
avatar_url` },
    { http: "patch", endpoint: "/api/articles/:article_id", description: `Request body accepts:
an object in the form { inc_votes: newVote }
newVote will indicate how much the votes property in the database should be updated by
e.g.
{ inc_votes : 1 } would increment the current article's vote property by 1
{ inc_votes : -100 } would decrement the current article's vote property by 100
Responds with:
the updated article.
An article response object should also now include:

-comment_count which is the total count of all the comments with this article_id - you should make use of queries to the database in order to achieve this.` },
    { http: "get", endpoint: "/api/articles", description: `Responds with:

an articles array of article objects, each of which should have the following properties:

author which is the username from the users table
title
article_id
topic
created_at
votes
comment_count which is the total count of all the comments with this article_id - you should make use of queries to the database in order to achieve this.
the articles should be sorted by date in descending order.

Queries
The end point should also accept the following query:
- topic, which filters the articles by the topic value specified in the query. If the query is omitted the endpoint should respond with all articles.` },
    { http: "get", endpoint: "/api/articles/:article_id/comments", description: `Responds with:

an array of comments for the given article_id of which each comment should have the following properties:
comment_id
votes
created_at
author which is the username from the users table
body
comments should be served with the most recent comments first` },
    { http: "post", endpoint: "/api/articles/:article_id/comments", description: `Request body accepts:

an object with the following properties:
username
body
Responds with:

the posted comment` },
    { http: "get", endpoint: "/api/articles", description: `FEATURE REQUEST
The end point should also accept the following queries:

sort_by, which sorts the articles by any valid column (defaults to date)
order, which can be set to asc or desc for ascending or descending (defaults to descending)
` },
    { http: "delete", endpoint: "/api/comments/:comment_id", description: `Should:

delete the given comment by comment_id
Responds with:

status 204 and no content` },
  ];
    
  return Promise.resolve({ api });
};


const putArticle = async (newArticle) => {
  const { author, title, body, topic } = newArticle;

  // topic foreign key must be in topics table under topics.slug
  // author foreign key must be in users table under users.username

  let rows = undefined;

  let query1 = await db.query("SELECT * FROM topics WHERE topics.slug = $1", [
    topic,
  ]);
  if (query1.rows.length < 1) {
    return Promise.reject({
      status: 400,
      msg: "Article 'topic' json is a foreign key is not in the topics table 'topics.slug' ",
    });
  }

  let query2 = await db.query("SELECT * FROM users WHERE users.username = $1", [
    author,
  ]);
  if (query2.rows.length < 1) {
    return Promise.reject({
      status: 400,
      msg: "Article 'author' json is a foreign key is not in users table 'users.username' ",
    });
  }

  let query3 = await db.query(
    `INSERT INTO articles ( author , title , body , topic)
       VALUES ($1 , $2 , $3, $4)
       RETURNING *;`,
    [author, title, body, topic]);

  if (query3.rows.length < 1) {
    return Promise.reject({
      status: 400,
      msg: "Article failed to be added to database  ",
    });
  }

  let result = query3.rows[0];
  // not sure why want a comment count on newly posted article in database
  result.comment_count = 0;
  return result;
};




module.exports = {
    fetchArticles ,
    fetchArticle,
    adjustArticle ,
    fetchComments ,
    putComment,
    removeComment,
    fetchApi,
    putArticle
};
