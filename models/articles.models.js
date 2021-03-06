const db = require("../db/connection.js");

exports.fetchArticles = (sort_by = "created_at", order_by = "DESC", topic) => {
  if (
    ![
      "article_id",
      "author",
      "created_at",
      "title",
      "topic",
      "votes",
      "comment_count",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid Sort Query" });
  }
  if (!["ASC", "DESC", "asc", "desc"].includes(order_by)) {
    return Promise.reject({ status: 400, msg: "Invalid Order Query" });
  }

  let queryStr = `SELECT articles.article_id, articles.author, articles.created_at, articles.title, articles.topic, articles.votes, COUNT(comments.comment_id) AS comment_count
        FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const queryValues = [];
  if (topic) {
    queryValues.push(topic);
    queryStr += ` WHERE topic ILIKE $1`;
  }
  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order_by};`;
  return db.query(queryStr, queryValues).then(({ rows: articles }) => {
    if (articles.length === 0) {
      return Promise.reject({ status: 404, msg: "Invalid Search!" });
    }
    return articles;
  });
};

exports.checkingForValidTopic = (topic) => {
  return db
    .query(`SELECT slug = $1 FROM topics;`, [topic])
    .then(({ rows: validTopics }) => {
      if (validTopics.length === 0) {
        return Promise.reject({ status: 400, msg: "Invalid Topic" });
      }
    });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.author, articles.created_at, articles.title, articles.topic, articles.votes, articles.body, COUNT(comments.comment_id) AS comment_count
    FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID Does Not Exist!" });
      }
      return rows[0];
    });
};

exports.fetchComments = (article_id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID Does Not Exist" });
      } else return rows;
    });
};

exports.removeComment = (removeCom) => {
  const { comment_id } = removeCom;
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.addVotes = (article_id, newVote) => {
  const voteKeys = Object.keys(newVote);
  if (!(voteKeys.length === 1)) {
    return Promise.reject({ status: 400, msg: "Wrong Input!" });
  } else if (!(voteKeys[0] === "inc_votes")) {
    return Promise.reject({ status: 400, msg: "Incorrect Key!" });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [newVote.inc_votes, article_id]
    )
    .then(({ rows: articles }) => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article Does Not Exist!",
        });
      }
      return articles[0];
    });
};

exports.postComment = (newComment, article_id) => {
  const { username, body } = newComment;
  if (username.length === 0 || body.length === 0) {
    return Promise.reject({ status: 400, msg: "Missing Input!" });
  } else {
    return db
      .query(
        `INSERT INTO comments (author, body, article_id) 
            VALUES ($1, $2, $3) RETURNING *;`,
        [username, body, article_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  }
};

exports.removeArticle = (removeArt) => {
  const { article_id } = removeArt;
  return db
    .query(`DELETE FROM comments WHERE article_id = $1;`, [article_id])
    .then(`DELETE FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.addCommentVotes = (comment_id, newVote) => {
  const voteKeys = Object.keys(newVote);
  if (!(voteKeys.length === 1)) {
    return Promise.reject({ status: 400, msg: "Wrong Input!" });
  } else if (!(voteKeys[0] === "inc_votes")) {
    return Promise.reject({ status: 400, msg: "Incorrect Key!" });
  }
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [newVote.inc_votes, comment_id]
    )
    .then(({ rows: comment }) => {
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment Does Not Exist!",
        });
      }
      return comment[0];
    });
};

exports.postArticle = (newArticle) => {
  const { author, title, body, topic } = newArticle;
  if (Object.keys(newArticle).length > 4) {
    return Promise.reject({ status: 400, msg: "Additional Key Entered!" });
  } else if (Object.keys(newArticle).length < 4) {
    return Promise.reject({ status: 400, msg: "Missing Keys!" });
  } else if (
    author === undefined ||
    title === undefined ||
    body === undefined ||
    topic === undefined ||
    author.length === 0 ||
    title.length === 0 ||
    body.length === 0 ||
    topic.length === 0
  ) {
    return Promise.reject({ status: 400, msg: "Missing Input!" });
  }
  return db
    .query(
      `INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [author, title, body, topic]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
