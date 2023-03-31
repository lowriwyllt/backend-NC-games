const db = require("../../db/connection");

exports.fetchCategories = () => {
  const selectCatogoriesString = `
    SELECT * 
    FROM categories
    `;
  return db.query(selectCatogoriesString).then((response) => {
    return response.rows;
  });
};

exports.insertCategory = (slug, description) => {
  const insertCategoryStr = `
  INSERT INTO categories
  (slug, description)
  VALUES ($1, $2)
  RETURNING *
  `;
  return db.query(insertCategoryStr, [slug, description]).then((response) => {
    return response.rows[0];
  });
};
