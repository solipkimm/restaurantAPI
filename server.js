/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Solip Kim    Student ID: 120618194    Date: Jan 22 2021
* Heroku Link: https://cryptic-lowlands-55609.herokuapp.com/
*
********************************************************************************/

// Setup
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// database
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB("mongodb+srv://solip:solip@cluster0.jswyw.mongodb.net/sample_restaurants?retryWrites=true&w=majority");

// Add support for incoming JSON entities
app.use(bodyParser.json());
// Add support for CORS
app.use(cors());

// home
app.get("/", (req, res) => {
    res.json({ "message" : "API Listening"});
});

// Connection
db.initialize().then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

// POST /api/restaurants
app.post("/api/restaurants", (req, res) => {
    db.addNewRestaurant(req.body)
        .then((msg) => {
            res.status(201).json({ "message" : msg });
        }).catch((err) => {
            res.json({ "message" : err });
        });
});

// GET /api/restaurants
app.get("/api/restaurants", (req, res) => {
    db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough)
        .then((restaurants) => {
            res.json(restaurants);
        }).catch((err) => {
            res.status(404).json({ "message" : err });
        });
});

// GET /api/restaurants/:id
app.get("/api/restaurants/:id", (req, res) => {
    db.getRestaurantById(req.params.id)
        .then((restaurant) => {
            res.json(restaurant);
        }).catch((err) => {
            res.status(404).json({ "message" : err });
        });
});

// PUT /api/restaurants/:id
app.put("/api/restaurants/:id", (req, res) => {
    db.getRestaurantById(req.params.id)
        .then((restaurant) => {
            db.updateRestaurantById(req.body, req.params,id)
                .then((msg) => {
                    res.json({ "message" : msg });
                });
        }).catch((err) => {
            res.status(404).json({ "message" : err });
        });
});

// DELETE /api/restaurants.:id
app.delete("/api/restaurants.:id", (req, res) => {
    db.deleteRestaurantById(req.params.id)
        .then((msg) => {
            res.status(204).end();
        }).catch((err) => {
            res.status(404).json({ "message" : err })
        })

})