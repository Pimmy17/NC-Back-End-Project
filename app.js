const express  = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getUsers } = require("./controllers/users.controllers");


const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/users", getUsers);


//Error Handling Section

//Bad Pathway
app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Incorrect Pathway =/"});
})


app.use((err, req, res, next) => {
    res.status(500).send( { msg: "Server Error =[" } );
})

module.exports = app;