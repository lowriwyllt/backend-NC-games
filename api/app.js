const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const {
  getComments,
  postComment,
} = require("./controllers/comments.controller");
const {
  getReviewById,
  getReviews,
  patchVotesToReview,
} = require("./controllers/reviews.controller");
const { errorPSQL400s, errorCustomised, error500 } = require("./errors");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getComments);
app.post("/api/reviews/:review_id/comments", postComment);
app.patch("/api/reviews/:review_id", patchVotesToReview);

app.use(errorPSQL400s);
app.use(errorCustomised);
app.use(error500);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Path does not exist" });
});

module.exports = app;
