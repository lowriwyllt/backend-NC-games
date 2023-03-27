const db = require("../../db/connection");

exports.fetchReviewById = (review_id) => {
  // if (isNaN(review_id)) {
  //   return Promise.reject({ status: 400, msg: "Invalid review_id" });
  // }
  const selectReviewString = `
      SELECT *
      FROM reviews
      WHERE review_id = $1
      `;
  return db.query(selectReviewString, [review_id]).then((response) => {
    return response.rows[0];
  });
};
