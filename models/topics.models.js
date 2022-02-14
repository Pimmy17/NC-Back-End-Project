const db = require("../db/connection.js");

exports.fetchTopics = () => {
    return db
    .query(`SELECT * FROM topics;`)
    .then(({ rows: topics }) => {
        console.log(topics)
        return topics;
    })
}