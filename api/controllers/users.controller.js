const { fetchUsers, fetchUser } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
};

exports.getUser = (req, res, next) => {
  const { username } = req.params;
  fetchUser(username)
    .then((user) => {
      if (user === undefined) {
        return Promise.reject({ status: 404, msg: "username does not exist" });
      }
      res.status(200).send({ user });
    })
    .catch((err) => next(err));
};
