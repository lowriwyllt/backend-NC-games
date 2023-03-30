const {
  fetchReviewById,
  fetchReviews,
  addVotes,
} = require("../models/reviews.model");
const { checkColumnExists } = require("../app-utils");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((review) => {
      if (review === undefined) {
        return Promise.reject({ status: 404, msg: "review_id does not exist" });
      }
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const { category, sort_by, order } = req.query;

  const promiseArr = [fetchReviews(category, sort_by, order)];

  if (category) {
    promiseArr.push(checkColumnExists("categories", "slug", category));
  }

  Promise.all(promiseArr)
    .then((result) => {
      res.status(200).send({ reviews: result[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotesToReview = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;

  Promise.all([
    addVotes(review_id, inc_votes, req.body),
    checkColumnExists("reviews", "review_id", review_id),
  ])
    .then((result) => {
      res.status(200).send({ review: result[0] });
    })
    .catch((err) => {
      next(err);
    });
};
