const { user } = require("pg/lib/defaults");
const { checkColumnExists } = require("../app-utils");
const { fetchComments, insertComment } = require("../models/comments.model");

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

exports.postComment = (req, res, next) => {
  console.log("CONTROLLER");
  const { review_id } = req.params;
  const { username, body } = req.body;

  console.log("id", review_id);
  console.log("user", username);
  console.log("body", body);

  Promise.all([
    insertComment(review_id, username, body),
    checkColumnExists("reviews", "review_id", review_id),
  ])
    .then((result) => {
      res.status(201).send({ comment: result[0] });
    })
    .catch((err) => {
      next(err);
    });
};
