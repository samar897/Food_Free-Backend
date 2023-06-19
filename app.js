 
//to call the lib express to use the func step 1
const express = require("express");  

//the Below varialbes will be call the Router to use them on app. 
const AdminRouter = require("./routes/AdminRouter");
const PrincipalRouter = require("./routes/CommunityRouter");
const UserRouter = require("./routes/UserRouter");
const FoodFreeRouter = require("./routes/FoodFreeRouter");
const CommunityRouter = require("./routes/CommunityRouter");

 
// call the opject from lib step 2
const app = express();  

let cors = require('cors')
//declear var to call mongoose to connection to DB.
const mongoose = require("mongoose")

//here we will create a session and Coockies for User the Webpage
const cookieParser = require("cookie-parser");   
const session = require("express-session"); 

//you should hash (encrypt) the passwords in the database.
const bcrypt = require("bcrypt"); 

/*
Dotenv is a module that loads environment variables from a 
.env file into process.env. Storing configuration 
in the environment separate from code is based on The Twelve-Factor App methodology.
*/
const dotenv= require("dotenv"); 
dotenv.config();

//to take the value from form and they can read it
const bodyParser = require("body-parser"); 
app.use(bodyParser.urlencoded({ extended: false }));

//to use json and send it to API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//to Create a token for student
const jwt = require("jsonwebtoken");
app.use(cors());
//here the express can read the exe ejs
app.set("view engine", "ejs");  

//to use the image on ejs file with the path. external package 
app.use(express.static("public"));
app.use("/images", express.static("images"));


//The CSS file will be appeare when we use this command with the path. external package 
app.use(express.static("public"));
app.use("/css", express.static("css"));

app.use(session({ secret: "my secret" })); 
app.use(cookieParser()); 



// we are using the variables above so we can access the router there 
app.use("/AdminRouter", AdminRouter);
app.use("/UserRouter", UserRouter);  
app.use("/FoodFreeRouter", FoodFreeRouter);  
app.use("/CommunityRouter",CommunityRouter); 


//to call and connect the server to DB, I will take the ULR to connect from MOngodb db.
//we will create invarimnent varible we need to install dotenv
// # install locally (recommended) npm install dotenv --save
//Create file .env on root file key=value.
//import and require the dotenv
//porocess.env 

mongoose.connect(process.env.DB_URL).then(() => { 
  //If the connection finished print the result on console
  console.log("=======connection succeeded========");
}) 
.catch((error) => {  
  //if there is any error will be show for you.
  console.log("=======connection not succeeded========");
  console.log(error.message);
});   
 

app.get("/", (req, res) => {
  res.render("HomePage.ejs");
});
   
//STEP3 we will use the app from express lib to listen port
app.listen(8000, function () {
  console.log("listening");
});




