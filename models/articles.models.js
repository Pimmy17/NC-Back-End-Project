const db = require("../db/connection.js");

exports.fetchArticles = () => {
    return db
    .query(`SELECT article_id, author, created_at, title, topic, votes FROM articles ORDER BY created_at DESC;`)
    .then(({ rows: articles }) => {
        // console.log(articles)
        return articles;
    })
}

exports.fetchArticleById = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Woah! We're not that big yet!"})
        }
        return rows;
    })
}