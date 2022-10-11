const { fetchUsers } = require("../models/usersModel");

const getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => res.status(200).send({ users }))
    .catch((err) => next(err));
};

module.exports = {
  getUsers,
};
