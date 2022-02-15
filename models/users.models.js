const db = require("../db/connection.js");

exports.fetchUsers = () => {
    return db
    .query(`SELECT username FROM users;`)
    .then(({ rows: users }) => {
        // console.log(users)
        return users;
    })
}