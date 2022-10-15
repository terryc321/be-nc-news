const {
    adjustComment,
    fetchComment,
      } = require("../models/commentsModel");


const patchComment = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    
    adjustComment( comment_id , inc_votes).then(
        comment =>  res.status(201).send({comment })
    ).catch(next);
};

// **** ticket 18
const getComment = (req, res, next) => {
    const { comment_id } = req.params;
    
    fetchComment(comment_id).then(
        comment => res.status(200).send({ comment })
    ).catch(next);
};


module.exports = {
    patchComment,
    getComment
};

