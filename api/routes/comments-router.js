const {
  deleteAComment,
  patchAComment,
} = require("../controllers/comments.controller");
const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteAComment);
commentsRouter.patch("/:comment_id", patchAComment);

module.exports = commentsRouter;
