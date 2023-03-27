const express = require("express");
const { getCategories } = require("./controllers/categories.controller");

const app = express();

app.get("/api/categories", getCategories);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Path does not exist" });
});

module.exports = app;
