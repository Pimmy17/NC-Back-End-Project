const express  = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getUsers } = require("./controllers/users.controllers");
const { getArticles, getArticleById, getComments } = require("./controllers/articles.controllers");



const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getComments);


//Error Handling Section

//Bad Pathway
app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "Incorrect Pathway =/"});
    next(err);
})

app.use((err, req, res, next) => {
    if(err.code === '22P02'){
      res.status(400).send({msg: 'Wrong Input!'})
    }
    else next(err)
  })
  
  app.use((err, rew, res, next) => {
    if(err.code === '23503'){
      res.status(400).send({msg: 'Incorrect Input!'})
    }
    else next(err)
  })
  
  app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } 
    else next(err);
  });


app.use((err, req, res, next) => {
    res.status(500).send( { msg: "Server Error =[" } );
})

module.exports = app;