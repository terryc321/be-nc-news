
const psql_codes = require('./postgres-codes');

const hasPSQLReason = (code) => {
    const result = psql_codes[code];
    return result ? result : null;    
}


const handleJSErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
      res.status(err.status).send({ msg : err.msg });
  } else {
    next(err);
  }
};


const handlePSQLErrors = (err, req, res, next) => {
    const psqlErr = psql_codes[code];    
  if (err.status === code) {
      res.status(400).send({ msg : err.message , psql : psqlErr });
  } else {
    next(err);
  }
};

const handleServerErrors = (err, req, res, next) => {    
    res.status(500).send({ msg : 'Internal Server Error' });
};


const handleErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else if (hasPSQLReason(err.status)){
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


