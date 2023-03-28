const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const {
  getReviewById,
  getReviews,
} = require("./controllers/reviews.controller");
const { errorPSQL400s, errorCustomised, error500 } = require("./errors");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews", getReviews);

app.use(errorPSQL400s);
app.use(errorCustomised);
app.use(error500);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Path does not exist" });
});

module.exports = app;
