const { response } = require("express");
const db = require("../../db/connection");

exports.fetchComments = (reviewId) => {
  const selectCommentsString = `
    SELECT *
    FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC;
    `;
  return db.query(selectCommentsString, [reviewId]).then((response) => {
    return response.rows;
  });
};

exports.insertComment = (review_id, username, body) => {
  const insertCommentsString = `
    INSERT INTO comments
    (review_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
  return db
    .query(insertCommentsString, [review_id, username, body])
    .then((response) => {
      return response.rows[0];
    });
};

exports.removeAComment = (commentId) => {
  const deleteCommentStr = `
  DELETE FROM comments
  WHERE comment_id = $1`;
  return db.query(deleteCommentStr, [commentId]);
};

exports.addVotesToComment = (comment_id, inc_votes, body) => {
  if (Object.keys(body).length > 1 || !inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Invalid format: has invalid properties",
    });
  }
  const updateVoteToCommentStr = `
  UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *`;
  return db
    .query(updateVoteToCommentStr, [inc_votes, comment_id])
    .then((response) => {
      return response.rows[0];
    });
};
