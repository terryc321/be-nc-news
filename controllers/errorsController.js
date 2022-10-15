

const handlePSQLErrors = (err, req, res, next) => {
  if (err.code) {
      res.status(400).send({ msg : err.msg });
  } else {
    next(err);
  }
};


const handleJSErrors = (err, req, res, next) => {
  if (err.status) {
      res.status(err.status).send({ msg : err.msg });
  } else {
    next(err);
  }
};

const handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ err });
};


module.exports = {
    handlePSQLErrors ,
    handleJSErrors,
    handleServerErrors
};


