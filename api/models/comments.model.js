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
