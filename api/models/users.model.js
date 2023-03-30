const db = require("../../db/connection");

exports.fetchUsers = () => {
  const selectUsersStr = `
    SELECT * 
    FROM users`;
  return db.query(selectUsersStr).then((response) => {
    return response.rows;
  });
};

exports.fetchUser = (username) => {
  const selectUserStr = `
  SELECT * 
  FROM users
  WHERE username = $1`;
  return db.query(selectUserStr, [username]).then((response) => {
    return response.rows[0];
  });
};
