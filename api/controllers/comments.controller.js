// const { user } = require("pg/lib/defaults");
const { checkColumnExists } = require("../app-utils");
const {
  fetchComments,
  insertComment,
  removeAComment,
} = require("../models/comments.model");

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
  const { review_id } = req.params;
  const { username, body } = req.body;

  insertComment(review_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteAComment = (req, res, next) => {
  const { comment_id } = req.params;

  removeAComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};
