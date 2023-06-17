//on this file we will have Schema for Instructor we will create 6 row as below
const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const AdmainSchema = new Schema({
  FullAdminName: {
    type: String,
    required: [true, "you should fill the First Name"],
  },
  AdminPassword :{
    type: String,
    selecte: false,
    require: [true, "you should fill the Password"],
    },
    AdminEmail: {
    type: String,
    required: [true, "you should fill the Email"],
    unique: true,
  },
  AdminFoodFreeID: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodFree",//here we put name of the model we want to connect with it.
  }]
},
{

  timestamps: true,
},
);

AdmainSchema.plugin(uniqueValidator);

const Admin = mongoose.model("Admins", AdmainSchema);

module.exports = Admin;


