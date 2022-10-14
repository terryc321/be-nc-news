const db = require("../db/connection");


const sql_sanitize = (str = "") => {
    return str.replace(/[^a-z0-9 _-]/gi, '');
}


const adjustComment = (comment_id, inc_votes) => {
    if(inc_votes === undefined){
        return Promise.reject({status : 400 , msg : "patch request requires 'inc_votes' json to be defined"});
    }
  return db
    .query(
      `UPDATE comments
       SET votes = votes + $2
       WHERE comment_id = $1
       RETURNING *;`,
        [comment_id , inc_votes]
    )
    .then(({ rows }) => {
      return rows[0];
    }).catch((err) => {
        return Promise.reject(err);
    });
};


const fetchComment = (comment_id) => {
    if (comment_id === undefined) {
        return Promise.reject({ status: 400, msg: "request requires 'comment_id' json to be defined" });
    }
    if (isNaN(comment_id)) {
        return Promise.reject({ status: 400, msg: "'comment_id' in /api/comments/:comment_id is expected to be a number" });
    }

  return db.query(`SELECT * from comments WHERE comment_id = $1 ;`, [comment_id])
        .then(({ rows: comments }) => {
        if (comments.length < 1) {
        return Promise.reject({
          status: 400,
          msg: "Comment not found for comment_id given",
        });
      }
      return comments[0];
    }).catch((err) => {
      return Promise.reject(err);
    });
};


module.exports = {
    adjustComment,
    fetchComment,
};
