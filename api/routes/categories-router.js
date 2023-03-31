const {
  getCategories,
  postCategory,
} = require("../controllers/categories.controller");
const categoriesRouter = require("express").Router();

categoriesRouter.get("/", getCategories);
categoriesRouter.post("/", postCategory);

module.exports = categoriesRouter;
