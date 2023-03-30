const {
  getReviewById,
  getReviews,
  patchVotesToReview,
} = require("../controllers/reviews.controller");
const {
  getComments,
  postComment,
} = require("../controllers/comments.controller");
const reviewsRouter = require("express").Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReviewById);
reviewsRouter.patch("/:review_id", patchVotesToReview);
reviewsRouter.get("/:review_id/comments", getComments);
reviewsRouter.post("/:review_id/comments", postComment);

module.exports = reviewsRouter;
