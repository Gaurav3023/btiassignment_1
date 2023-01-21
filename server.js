/*********************************************************************************
*  BTI425 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Gaurav Saini   Student ID: 113460190    Date: Thursday, Jan 19, 2023
*  Cyclic Link: 
*
********************************************************************************/ 

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const MoviesDB = require("./modules/moviesDB.js");
const app = express();

app.use(cors());
app.use(express.json());

//create a new instance of the MoviesDB
const db = new MoviesDB();

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    const port = process.env.HTTP_PORT || 3000;
    app.listen(port, ()=>{
        console.log(`server listening on: ${port}`);
    });
}).catch((err)=>{
    console.log(err);
});

app.get("/", (req, res) => {
    res.json({ message: "API Listening" });
});

app.post("/api/movies", (req, res) => {
    db.addNewMovie(req.body)
        .then(movie => res.status(201).json(movie))
        .catch(err => res.status(500).json({ message: err }));
});

app.get("/api/movies", (req, res) => {
    const { page, perPage, title } = req.query;
    db.getAllMovies({ page, perPage, title })
        .then(movies => res.json(movies))
        .catch(err => res.status(500).json({ message: err }));
});

app.get("/api/movies/:id", (req, res) => {
    db.getMovieById(req.params.id)
        .then(movie => res.json(movie))
        .catch(err => res.status(500).json({ message: err }));
});

app.put("/api/movies/:id", (req, res) => {
    db.updateMovieById(req.params.id, req.body)
        .then(() => res.status(204).send())
        .catch(err => res.status(500).json({ message: err }));
});

app.delete("/api/movies/:id", (req, res) => {
    db.deleteMovieById(req.params.id)
        .then(() => res.status(204).send())
        .catch(err => res.status(500).json({ message: err }));
}); 


