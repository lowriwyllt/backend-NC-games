const { fetchReviewById } = require("../models/reviews.model");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((review) => {
      if (review === undefined) {
        return Promise.reject({ status: 404, msg: "Review_id does not exist" });
      }
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
