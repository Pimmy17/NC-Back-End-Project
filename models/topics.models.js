const db = require("../db/connection.js");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows: topics }) => {
    return topics;
  });
};

exports.postTopic = (newTopic) => {
  const { slug, description } = newTopic;
  if (slug.length === 0 || description.length === 0) {
    return Promise.reject({ status: 400, msg: "Missing Input!" });
  } else {
    return db
      .query(
        `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`,
        [slug, description]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  }
};
