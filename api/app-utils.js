const db = require("../db/connection");

exports.checkColumnExists = (table, column, value) => {
  const greenListTables = ["categories", "comments", "reviews", "users"];
  const greenListColumns = {
    categories: ["slug", "description"],
    comments: [
      "comment_id",
      "body",
      "review_id",
      "author",
      "votes",
      "created_at",
    ],
    reviews: [
      "review_id",
      "title",
      "category",
      "designer",
      "owner",
      "review_body",
      "review_img_url",
      "created_at",
      "votes",
    ],
    users: ["username", "name", "avatar_url"],
  };

  if (
    greenListTables.includes(table) &&
    greenListColumns[table].includes(column)
  ) {
    const arrParameters = [value];
    const selectReviewString = `
      SELECT *
      FROM ${table}
      WHERE ${column} = $1;
      `;
    return db.query(selectReviewString, arrParameters).then((result) => {
      if (result.rowCount === 0) {
        return { status: 404, msg: `${column} does not exist` };
      }
    });
  }
};
