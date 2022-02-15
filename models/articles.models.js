const db = require("../db/connection.js");

exports.fetchArticles = () => {
    return db
    .query(`SELECT article_id, author, created_at, title, topic, votes FROM articles ORDER BY created_at DESC;`)
    .then(({ rows: articles }) => {
        return articles;
    })
}

exports.fetchArticleById = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "ID Does Not Exist!"})
        }
        return rows[0];
    })
}

exports.fetchComments = (article_id) => {
    return db
    .query(`SELECT * FROM comments WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
        return rows;
    })
}

exports.checkArticleExists = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: 'ID Does Not Exist'})
        }
        else return rows;
    })
}