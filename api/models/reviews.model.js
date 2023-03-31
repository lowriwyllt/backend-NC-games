const db = require("../../db/connection");

exports.fetchReviewById = (review_id) => {
  const selectReviewString = `
    SELECT reviews.review_id, 
    reviews.title, 
    reviews.review_body,
    reviews.designer, 
    reviews.review_img_url, 
    reviews.votes,   
    reviews.category, 
    reviews.owner, 
    reviews.created_at, 
    CAST(COUNT(comments.comment_id) AS INT) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id
      `;
  return db.query(selectReviewString, [review_id]).then((response) => {
    return response.rows[0];
  });
};

exports.fetchReviews = (category, sort_by = "created_at", order = "desc") => {
  const reviewsGreenList = [
    "review_id",
    "title",
    "category",
    "designer",
    "owner",
    "review_body",
    "review_img_url",
    "created_at",
    "votes",
  ];
  if (sort_by && !reviewsGreenList.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid sort_by query" });
  }
  if (order && order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: "invalid order query" });
  }
  const queryParams = [];
  let selectReviewsString = `
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
  ON comments.review_id = reviews.review_id`;
  if (category) {
    selectReviewsString += ` WHERE category = $1 `;
    queryParams.push(category);
  }
  selectReviewsString += `  GROUP BY reviews.review_id
  ORDER BY reviews.${sort_by} ${order}; `;

  return db.query(selectReviewsString, queryParams).then((response) => {
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

exports.insertReview = (
  owner,
  title,
  review_body,
  designer,
  category,
  review_img_url
) => {
  // const insertReviewStr = `
  // WITH new_rows AS (
  //   INSERT INTO reviews
  //   (owner, title, review_body, designer, category, review_img_url)
  //   VALUES ($1, $2, $3, $4, $5, $6)
  //   RETURNING *
  // )
  // SELECT reviews.*, COUNT(comments.comment_id) AS comment_count
  // FROM comments
  // RIGHT JOIN comments
  //   ON comments.review_id = reviews.review_id
  // WHERE comments.review_id = (SELECT review_id FROM new_rows);
  // `;
  const insertReviewStr = `WITH new_review AS (
    INSERT INTO reviews
    (owner, title, review_body, designer, category, review_img_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  ),
  comment_count AS (
    SELECT CAST(COUNT(*) AS INT) AS count
    FROM comments
    WHERE review_id = (SELECT review_id FROM new_review)
  )
  SELECT new_review.*, comment_count.count AS comment_count
  FROM new_review, comment_count;`;

  return db
    .query(insertReviewStr, [
      owner,
      title,
      review_body,
      designer,
      category,
      review_img_url,
    ])
    .then((response) => {
      return response.rows[0];
    });
};
