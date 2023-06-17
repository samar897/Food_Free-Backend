const express = require("express");

const router = express.Router();
const autoMiddlware = require("../middleware/checkLoggedInUser");
const saltRounds = 10;
const dotenv= require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();

const UserDB = require("../models/User");
const FoodsFreeDB = require("../models/FoodFree");
const Community = require("../models/Community");








module.exports = router;
 