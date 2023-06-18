//on this file we will have Schema for Instructor we will create 6 row as below
const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const CommunitySchema = new Schema({
  TopicName: {
    type: String,
    required: [true, "you should fill the Topic Name"],
  },
  ContentName: {
    type: String,
    required: [true, "you should fill the Content Name"],
  },
  CommUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",//here we put name of the model we want to connect with it.
  }
}, 
{

  timestamps: true,
},
); 

CommunitySchema.plugin(uniqueValidator);

const Community = mongoose.model("Communities", CommunitySchema);

module.exports = Community;


