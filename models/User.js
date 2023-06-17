//on this file we will have Schema for Instructor we will create 6 row as below
const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  FullUserName: {
    type: String,
    required: [true, "you should fill the Fisrt Name"],
  },
  UserPassword :{
    type: String,
    selecte: false,
    require: [true, "you should fill the Password"],
    },
    UserEmail: {
    type: String,
    required: [true, "you should fill the Email"],
    unique: true,
  },
  userFoodFree: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodFree",//here we put name of the model we want to connect with it.
  }],
  UserComm: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",//here we put name of the model we want to connect with it.
  }]
},
{

  timestamps: true,
},
);

UserSchema.plugin(uniqueValidator);

const User = mongoose.model("Users", UserSchema);

module.exports = User;


