const db = require("../../db/connection");

exports.fetchReviewById = (review_id) => {
  const selectReviewString = `
      SELECT *
      FROM reviews
      WHERE review_id = $1
      `;
  return db.query(selectReviewString, [review_id]).then((response) => {
    return response.rows[0];
  });
};

exports.fetchReviews = () => {
  const selectReviewsString = `
  SELECT reviews.owner, 
  reviews.title, 
  reviews.review_id, 
  reviews.category, 
  reviews.review_img_url, 
  reviews.created_at, 
  reviews.votes, 
  reviews.designer, 
  CAST(COUNT(comments.comment_id) AS INT) AS comment_count 
  FROM reviews
  LEFT JOIN comments
  ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC; 
      `;
  return db.query(selectReviewsString).then((response) => {
    return response.rows;
  });
};

exports.addVotes = (review_id, inc_votes, body) => {
  if (Object.keys(body).length > 1 || !inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Invalid format: has invalid properties",
    });
  }
  const updateVoteToReviewsStr = `
  UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *`;
  return db
    .query(updateVoteToReviewsStr, [inc_votes, review_id])
    .then((response) => {
      return response.rows[0];
    });
};
