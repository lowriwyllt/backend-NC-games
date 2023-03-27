const db = require("../../db/connection");
const categories = require("../../db/data/test-data/categories");

exports.fetchCategories = () => {
  const selectCatogoriesString = `
    SELECT * 
    FROM categories
    `;
  return db.query(selectCatogoriesString).then((response) => {
    return response.rows;
  });
};
