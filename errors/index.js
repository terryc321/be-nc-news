
/*
const handleJSErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
      res.status(400).send({ msg : err.msg });
  } else {
    next(err);
  }
};


const handlePSQLErrors = (err, req, res, next) => {
  if (err.status === '22P02') {
      res.status(400).send({ msg : err.message || 'Bad Request' });
  } else {
    next(err);
  }
};

const handleServerErrors = (err, req, res, next) => {    
    res.status(500).send({ msg : 'Internal Server Error' });
};

*/

const handleErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
  } else if (err.status === "22P02") {
      res.status(400).send({ msg: err.message || "Bad Request" });
  } else {
      res.status(500).send({ msg: "Internal Server Error" });
  }
};


module.exports = {
    // handlePSQLErrors ,
    // handleJSErrors,
    // handleServerErrors,
    handleErrors
};


