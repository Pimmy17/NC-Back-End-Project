const express = require("express");
const { getTopics, addTopic } = require("./controllers/topics.controllers");
const {
  getUsers,
  getUserByUsername,
} = require("./controllers/users.controllers");
const {
  getArticles,
  getArticleById,
  getComments,
  deleteComment,
  updateVotes,
  addComment,
  deleteArticle,
  updateCommentVotes,
  addArticle,
} = require("./controllers/articles.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");
const cors = require("cors");

app.use(cors());
const app = express();
app.use(express.json());
//Gets
app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getComments);
app.get("/api/users/:username", getUserByUsername);
//Deletes
app.delete("/api/articles/:article_id/:comment_id", deleteComment);
app.delete("/api/articles/:article_id", deleteArticle);
//Patches
app.patch("/api/articles/:article_id", updateVotes);
app.patch("/api/articles/:article_id/:comment_id", updateCommentVotes);
//Posts
app.post("/api/articles/:article_id/comments", addComment);
app.post("/api/topics", addTopic);
app.post("/api/articles", addArticle);

//Error Handling Section
app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Incorrect Pathway =/" });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Wrong Input!" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(400).send({ msg: "Incorrect Input!" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server Error =[" });
});

module.exports = app;
