const express = require("express");

const FoodFreeDB = require("../models/FoodFree");
const router2 = express.Router();

const AdminDB = require("../models/Admin");
const saltRounds = 10;
const dotenv= require("dotenv");

//const Insoma = require('insoma');
const bcrypt = require("bcrypt");

dotenv.config();

const autoMiddlware = require("../middleware/checkLoggedInAdmin");

const isLoggedIn = autoMiddlware.isLoggedIn;
const checkAuthor = autoMiddlware.checkAuthor;

/*Note Every error will be showing for you on another 
page to understand the error come from what. res.render("errorMessage.ejs", { data: error.message });
and I use Window history.back() with button to go back 
*/


router2.get("/ListFoodfree",isLoggedIn, checkAuthor ,(req, res) => {


  const object = res.locals.object;
  const adminlogin = object.adminlogin.id; 
 
  //console.log(AdminID + " AdminID ");
  console.log('====================================');
  console.log(adminlogin+" authHeader");
  console.log('====================================');

  if (adminlogin) {
  
    FoodFreeDB.find().then((FoodFreeDB) => { 
      res.json({ FoodFreeData : FoodFreeDB});
   //res.render("OneListCourses.ejs", { data: courses, foundAdmin});
  })
  .catch((error) => {
    res.json({ error: error.message });
   // res.render("errorMessage.ejs", { data: error.message });
  });

} else {
  res.json({ error: error.message });
}
});  

//the control will be get and print the ejs file for OneListCourses for one Course 
router2.get("/OneListFoodfree/:FoodFreeID",isLoggedIn, checkAuthor, (req, res) => {

  const FoodFreeID =req.params.FoodFreeID;
  //const foundAdmin=req.session.foundAdmin;

  console.log(FoodFreeID+" "+ "FoodFreeID");



  const object = res.locals.object;
  const adminlogin = object.adminlogin.id; 
 

  //console.log(AdminID + " AdminID ");
  console.log('====================================');
  console.log(adminlogin+" adminlogin");
  console.log('====================================');
    
      if (adminlogin) {
      
        FoodFreeDB.findById(FoodFreeID).then((FoodFreeDB) => { 
          res.json({ FoodFreeData : [FoodFreeDB]});
       
      })
      .catch((error) => {
        res.json({ error: [error.message] });
      
      });
    
    } else {
      res.json({ error: error.message });
    }
    });  

/* the below code is done */
      

//the action will be to add new courses
router2.post("/AddnewFoodFree",isLoggedIn, checkAuthor, function (req, res) {
 

  const object = res.locals.object;
  const adminlogin = object.adminlogin.id; 

 
  //console.log(AdminID + " AdminID ");
  console.log('====================================');
  console.log(adminlogin+" authHeader");
  console.log('====================================');

 
//console.log(AdminID + " AdminID ");
console.log('====================================');
console.log(adminlogin+" adminlogin");
console.log('====================================');

 
  if (adminlogin) {
    const Food_Free_Name = req.body.Food_Free_Name;
    const FoodDescription  = req.body.FoodDescription;
    const AllergyStatus = req.body.AllergyStatus;
    const RequestStatus = req.body.RequestStatus;
    const FoodType = req.body.FoodType;
      

    AdminDB.findById(adminlogin).then((foundAdmin) => {
      //Courses.findById("645e28228d444e8fd9b420be").then((course) => {
          const Newfoodfree = new FoodFreeDB({
            Food_Free_Name: Food_Free_Name,
            FoodDescription: FoodDescription,       
            AllergyStatus :AllergyStatus,    
            RequestStatus :RequestStatus,
            FoodType:FoodType,
            AdminFoodAllergy: foundAdmin,       
          });

          //to save the data on DB from form

  
          Newfoodfree.save().then((savedvalue) => {
            foundAdmin.AdminFoodFreeID.push(savedvalue);
            foundAdmin.save().then((savedvalue) => {
              //course.InstCor = savedvalue._id;
              //course.save().then((savedvalue) => {
              console.log("record created in DB");
              res.json({ Message: "Record Created in DB", Data:savedvalue});
              //});
            //});
          }).catch((error) => {
            console.log("record not created in DB");
            console.log(error.message);
            res.json({ error: error});
          });
        })
        .catch((error) => {
          console.log("record not created in DB");
          console.log(error.message);
          res.json({ error: error});
        });
    });  
} else {
  res.json({ Message: "Please Login First"});
 //res.render("errorMessage.ejs", { data: "Please Login First" });
}
});
       
/*/DeleteFoodFree/:FoodFreeID Done we need to update from two side delete */ 

//to delete courses from db with code 
router2.delete("/DeleteFoodFree/:FoodFreeID",isLoggedIn, checkAuthor, (req, res) => {

  
  console.log(FoodFreeID+" "+ "FoodFreeID");



  const object = res.locals.object;
  const adminlogin = object.adminlogin.id; 
  //const AdminID = req.session.foundAdmin;
  const FoodFreeID = req.params.FoodFreeID;

  console.log(FoodFreeID+" FoodFreeID");


   if (adminlogin) {
    FoodFreeDB.findById(FoodFreeID).then((foundAdmin) => {
    if(foundAdmin.AdminFoodAllergy!=adminlogin){

  
      console.log(foundAdmin.AdminFoodAllergy+" foundAdmin.AdminFoodAllergy");
      res.json({ error: "You are Not Allowed"});
    
    } else {
      FoodFreeDB.findByIdAndDelete(FoodFreeID).then(() => { 
   console.log("deleted");
   res.json({ Message: "Deleted"});

  }).catch((error) => {
    res.json({ error: error.message});
   
    
  }).catch((error) => {
    res.json({ error: error.message});
  
  });
}
  });
 
} else {
  res.json({ error: "Please Login First"});
 // res.render("errorMessage.ejs", { data: "Please Login First" });
}
});


//the Last two Control will be update the database for courses  
router2.post("/FoodFreeUpdate/:FoodFreeID",isLoggedIn, checkAuthor, (req, res) => {

  const FoodFreeID = req.params.FoodFreeID;
  //const InstructorID = req.session.InstructorID;


  const object = res.locals.object;
  const adminlogin = object.adminlogin.id; 
 

  
 
  //console.log(AdminID + " AdminID ");
  console.log('====================================');
  console.log(adminlogin+" authHeader");
  console.log('====================================');

    const Food_Free_Name = req.body.Food_Free_Name;
    const FoodDescription  = req.body.FoodDescription;
    const AllergyStatus = req.body.AllergyStatus;
    const FoodType = req.body.FoodType;
    const RequestStatus = req.body.RequestStatus;

  console.log(FoodFreeID+" FoodFreeID");


    if (adminlogin) {
     
      FoodFreeDB.findById(FoodFreeID).then((foodfreevalue) => {
        foodfreevalue.Food_Free_Name=Food_Free_Name;
        foodfreevalue.FoodDescription= FoodDescription;       
        foodfreevalue.AllergyStatus =AllergyStatus; 
        foodfreevalue.FoodType =FoodType;
        foodfreevalue.RequestStatus =RequestStatus;
        
             
        foodfreevalue.save().then(() => {
                  console.log();
               
                  res.json({ Message: "Record Updated in DB"});
        })
          .catch((error) => {
           
            console.log("The Record not update");
            res.json({ Message: "The Record not update", error:error.message});
          });
    });
  } else {
    res.json({ Message: "Please Login First" });
  
   }
  
   });
module.exports = router2;


/*

- the Admin  able to add a new course.
- the Admin  able to edit the course.
- the Admin  able to list all the courses he/she created.
- the Admin  able to delete any of the courses he created.
-There are no one can dalete or update for other only them self

*/


