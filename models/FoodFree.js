//on this file we will have Schema for Instructor we will create 6 row as below
const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const FoodFreeSchema = new Schema({
    Food_Free_Name: {
    type: String,
    required: [true, "you should fill the Food_Free_Name"],
  },
    FoodType: {
    type: String,
    required: [true, "you should fill the FoodType"],
  },
    FoodDescription: {
    type: String,
    required: [true, "you should fill the Food Description"],
  },
  AllergyStatus: {
    type: Boolean,
  },
  RequestStatus: {
    type: Boolean,
  },
  UserFoodAllergy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",//here we put name of the model we want to connect with it.
  }],
  AdminFoodAllergy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",//here we put name of the model we want to connect with it.
  }
},
{

  timestamps: true,
},
);

FoodFreeSchema.plugin(uniqueValidator);

const FoodFree = mongoose.model("FoodFree", FoodFreeSchema);

module.exports = FoodFree;


