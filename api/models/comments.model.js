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
  console.log("MODEL");
  const insertCommentsString = `
    INSERT INTO comments
    (review_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
  return db
    .query(insertCommentsString, [review_id, username, body])
    .then((response) => {
      console.log("QUERY");
      return response.rows[0];
    });
};
