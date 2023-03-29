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
