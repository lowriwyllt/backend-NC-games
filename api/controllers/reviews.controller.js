const {
  fetchReviewById,
  fetchReviews,
  addVotes,
  insertReview,
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
  const { category, sort_by, order, limit, p } = req.query;

  const promiseArr = [fetchReviews(category, sort_by, order, limit, p)];

  if (category) {
    promiseArr.push(checkColumnExists("categories", "slug", category));
  }
  Promise.all(promiseArr)
    .then((result) => {
      const reviews = result[0][1];
      const total_count = result[0][0].count;
      if (reviews.length === 0 && total_count > 0) {
        return Promise.reject({ status: 404, msg: "p (page) not found" });
      }
      res.status(200).send({ total_count, reviews });
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

exports.postReview = (req, res, next) => {
  const { owner, title, review_body, designer, category, review_img_url } =
    req.body;
  insertReview(owner, title, review_body, designer, category, review_img_url)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch((err) => next(err));
};
