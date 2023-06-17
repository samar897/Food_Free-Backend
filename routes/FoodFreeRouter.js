const express = require("express");

const FoodFreeDB = require("../models/FoodFree");
const router2 = express.Router();
const autoMiddlware = require("../middleware/checkLoggedInUser");
const AdminDB = require("../models/Admin");
const saltRounds = 10;
const dotenv= require("dotenv");

//const Insoma = require('insoma');
const bcrypt = require("bcrypt");

dotenv.config();

/*Note Every error will be showing for you on another 
page to understand the error come from what. res.render("errorMessage.ejs", { data: error.message });
and I use Window history.back() with button to go back 
*/


router2.get("/ListFoodfree", (req, res) => {

  const authHeader = req.headers.authorization;
 
  //console.log(AdminID + " AdminID ");
  console.log('====================================');
  console.log(authHeader+" authHeader");
  console.log('====================================');

  //const foundAdmin=req.session.foundAdmin;

  if (authHeader) {
  
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
router2.get("/OneListFoodfree/:FoodFreeID", (req, res) => {

  const FoodFreeID =req.params.FoodFreeID;
  //const foundAdmin=req.session.foundAdmin;

  console.log(FoodFreeID+" "+ "FoodFreeID");


      const authHeader = req.headers.authorization;
 
      //console.log(AdminID + " AdminID ");
      console.log('====================================');
      console.log(authHeader+" authHeader");
      console.log('====================================');
    
      //const foundAdmin=req.session.foundAdmin;
    
      if (authHeader) {
      
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
router2.post("/AddnewFoodFree", function (req, res) {
 

  //const req2 = Insoma.getRequest();
  //const AdminID = req2.session.AdminID;
  

  const authHeader = req.headers.authorization;
 
//console.log(AdminID + " AdminID ");
console.log('====================================');
console.log(authHeader+" authHeader");
console.log('====================================');
 
  if (authHeader) {
    const Food_Free_Name = req.body.Food_Free_Name;
    const FoodDescription  = req.body.FoodDescription;
    const AllergyStatus = req.body.AllergyStatus;
    const RequestStatus = req.body.RequestStatus;
      

    AdminDB.findById(authHeader).then((foundAdmin) => {
      //Courses.findById("645e28228d444e8fd9b420be").then((course) => {
          const Newfoodfree = new FoodFree({
            Food_Free_Name: Food_Free_Name,
            FoodDescription: FoodDescription,       
            AllergyStatus :AllergyStatus,    
            RequestStatus :RequestStatus,
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
router2.delete("/DeleteFoodFree/:FoodFreeID", (req, res) => {

  const authHeaderAdminID = req.headers.authorization;
 
  //console.log(AdminID + " AdminID ");
  console.log('====================================');
  console.log(authHeaderAdminID+" authHeader");
  console.log('====================================');
  //const AdminID = req.session.foundAdmin;
  const FoodFreeID = req.params.FoodFreeID;

  console.log(FoodFreeID+" FoodFreeID");


   if (authHeaderAdminID) {
    FoodFreeDB.findById(FoodFreeID).then((foundAdmin) => {
    if(foundAdmin.AdminFoodAllergy!=authHeaderAdminID){

      console.log(foundAdmin+" foundAdmin");
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
router2.post("/FoodFreeUpdate/:FoodFreeID", (req, res) => {

  const FoodFreeID = req.params.FoodFreeID;
  //const InstructorID = req.session.InstructorID;

          

  const authHeader = req.headers.authorization;
 
//console.log(AdminID + " AdminID ");
console.log('====================================');
console.log(authHeader+" authHeader");
console.log('====================================');

    const Food_Free_Name = req.body.Food_Free_Name;
    const FoodDescription  = req.body.FoodDescription;
    const AllergyStatus = req.body.AllergyStatus;
    const RequestStatus = req.body.RequestStatus;

  console.log(FoodFreeID+" FoodFreeID");


    if (authHeader) {
     
      FoodFreeDB.findById(FoodFreeID).then((foodfreevalue) => {
        foodfreevalue.Food_Free_Name=Food_Free_Name;
        foodfreevalue.FoodDescription= FoodDescription;       
        foodfreevalue.AllergyStatus =AllergyStatus; 
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


