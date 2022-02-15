const db = require("../db/connection.js");

exports.fetchArticles = () => {
    return db
    .query(`SELECT article_id, author, created_at, title, topic, votes FROM articles ORDER BY created_at DESC;`)
    .then(({ rows: articles }) => {
        console.log(articles)
        return articles;
    })
}