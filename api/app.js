const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const {
  getReviewById,
  getReviews,
} = require("./controllers/reviews.controller");
const { psqlErrors } = require("./errors");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews", getReviews);

app.use((err, req, res, next) => {
  if (err.code) {
    //PSQL Errors
    psqlErrors(err.code, res);
  } else if (err.status && err.msg) {
    //My personalised error messages
    res.status(err.status).send({ msg: err.msg });
  }
});

app.use((req, res, next) => {
  res.status(404).send({ msg: "Path does not exist" });
});

module.exports = app;
