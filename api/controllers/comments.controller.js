const { checkColumnExists } = require("../app-utils");
const { fetchComments } = require("../models/comments.model");

exports.getComments = (req, res, next) => {
  const { review_id } = req.params;

  Promise.all([
    fetchComments(review_id),
    checkColumnExists("reviews", "review_id", review_id),
  ])
    .then((result) => {
      res.status(200).send({ comments: result[0] });
    })
    .catch((err) => {
      next(err);
    });
};
