const express = require("express");
const app = express();

const apiRouter = require("./routes/api-router");
const categoriesRouter = require("./routes/categories-router");
const reviewsRouter = require("./routes/reviews-router");
const commentsRouter = require("./routes/comments-router");
const usersRouter = require("./routes/users-router");

const { errorPSQL400s, errorCustomised, error500 } = require("./errors");

app.use(express.json());
app.use("/api", apiRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/users", usersRouter);

app.use(errorPSQL400s);
app.use(errorCustomised);
app.use(error500);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Path does not exist" });
});

module.exports = app;
