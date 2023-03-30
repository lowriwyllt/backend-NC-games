const { fetchApi } = require("../models/api.model");

exports.getApi = (req, res, next) => {
  fetchApi()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch((err) => next(err));
};
