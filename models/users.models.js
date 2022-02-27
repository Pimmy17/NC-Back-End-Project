const db = require("../db/connection.js");

exports.fetchUsers = () => {
  return db.query(`SELECT username FROM users;`).then(({ rows: users }) => {
    return users;
  });
};

exports.fetchUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows: user }) => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "Invalid Username!" });
      }
      return user[0];
    });
};
