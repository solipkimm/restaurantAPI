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