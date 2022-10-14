const { fetchUsers ,
        fetchUser } = require("../models/usersModel");

const getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => res.status(200).send({ users }))
    .catch((err) => next(err));
};

const getUser = (req, res, next) => {
  const { username } = req.params;
  fetchUser(username)
    .then((user) => res.status(200).send({ user }))
    .catch((err) => next(err));
};


module.exports = {
    getUsers,
    getUser,
};
