const express  = require("express");
const { getTopics } = require("./controllers/topics.controllers");


const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);


//Error Handling Section

//Bad Pathway
app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Incorrect Pathway =/"});
})

// app.use((err, req, res, next) => {
//     const { status, msg } = err;
//     if(status){
//         res.status(status).send({ msg });
//     }
//     else next(err);
// })

app.use((err, req, res, next) => {
    res.status(500).send( { msg: "Server Error =[" } );
})

module.exports = app;