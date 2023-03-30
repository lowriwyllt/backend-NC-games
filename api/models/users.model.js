const db = require("../../db/connection");

exports.fetchUsers = () => {
  const selectUsersStr = `
    SELECT * 
    FROM users`;
  return db.query(selectUsersStr).then((response) => {
    return response.rows;
  });
};
