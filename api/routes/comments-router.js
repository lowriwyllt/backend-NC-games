const { deleteAComment } = require("../controllers/comments.controller");
const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteAComment);

module.exports = commentsRouter;
