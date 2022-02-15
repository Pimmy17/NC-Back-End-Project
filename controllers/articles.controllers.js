const { fetchArticles, fetchArticleById, fetchComments, checkArticleExists } = require("../models/articles.models.js");


exports.getArticles = (req, res, next) => {
    fetchArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
};

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    fetchArticleById(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getComments = (req, res, next) => {
    const {article_id} = req.params;
    Promise.all([fetchComments(article_id), checkArticleExists(article_id)])
    .then((promises) => {
        // console.log(comments)
        const comments = promises[0];
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
}

// exports.getComments = (req, res, next) => {
//     const {article_id} = req.params;
//     fetchComments(article_id)
//     .then((comments) => {
//         res.status(200).send({comments})
//     })
//     .catch((err) => {
//         next(err)
//     })
// }
