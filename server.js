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
  if (req.body){
    db.addNewRestaurant(req.body)
    .then((msg) => {
      res.status(201).json({ "message" : `Restaurant ${req.body.name} has been created` });
    }).catch((err) => {
      res.status(400).json({ "status" : "400 - Invalid Request",
                              "message" : "Cannot create a restaurant"
                            });
    });
  }
});

// GET /api/restaurants
app.get("/api/restaurants", (req, res) => {
  if (!req.query.page && !req.query.perPage){
    // default
    db.getAllRestaurants(1, 10)
    .then((restaurants) => {
      res.json(restaurants);
    }).catch((err) => {
      res.status(400).json({ "status" : "400 - Invalid Request",
                              "message" : "Please use path /api/restaurants or api/restaurants?perPage=<perPage>&page=<page>"
                            });
    });
  } else {
    db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough)
    .then((restaurants) => {
      res.json(restaurants);
    }).catch((err) => {
      res.status(400).json({ "status" : "400 - Invalid Request",
                              "message" : "Please use path /api/restaurants or api/restaurants?perPage=<perPage>&page=<page>"
                            });
    });
  }
});

// GET /api/restaurants/:id
app.get("/api/restaurants/:id", (req, res) => {
  if (req.params.id){
    db.getRestaurantById(req.params.id)
    .then((restaurant) => {
      res.json(restaurant);
    }).catch((err) => {
      res.status(404).json({ "status" : "404 - Not Found",
                              "message" : `Restaurant (id : ${req.params.id}) Not Found`
                            });
    });
  }
});

// PUT /api/restaurants/:id
app.put("/api/restaurants/:id", (req, res) => {
  if (req.params.id){
    db.getRestaurantById(req.params.id)
    .then((restaurant) => {
      db.updateRestaurantById(req.body, req.params,id)
        .then((msg) => {
          res.status(200).json({ "message" : `Restaurant ${req.body.name} has been updated` });
        });
    }).catch((err) => {
      res.status(404).json({ "status" : "404 - Not Found",
                              "message" : `Restaurant (id : ${req.params.id}) Not Found`
                            });
    });
  }
});

// DELETE /api/restaurants.:id
app.delete("/api/restaurants.:id", (req, res) => {
  if (req.params.id){
    db.deleteRestaurantById(req.params.id)
    .then((msg) => {
      res.status(204).json({ "message": `Restaurant (id : ${req.params.id}) has been deleted` }).end();
    }).catch((err) => {
      res.status(404).json({ "status" : "404 - Not Found",
                              "message" : `Restaurant (id : ${req.params.id}) Not Found`
                            });
    });
  }
})