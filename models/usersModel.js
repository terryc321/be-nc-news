const db = require("../db/connection");

const fetchUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows: users }) => {
    return users;
  }).catch((err) => {      
        return Promise.reject(err);
  });
};


const fetchUser = (username) => {
    return db.query(`SELECT * FROM users where username = $1;`,[username]).then(({ rows: users }) => {
        if (users.length < 1 ){
            return Promise.reject({
                status: 400,
                msg: "username not found in database",
            });
        }        
    return users[0];
  }).catch((err) => {
      return Promise.reject(err);
  });
};



module.exports = {
    fetchUsers,
    fetchUser
};
