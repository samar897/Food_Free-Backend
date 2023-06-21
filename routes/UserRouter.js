const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");    
const dotenv= require("dotenv"); 
dotenv.config();
const jwt = require("jsonwebtoken");

const FoodsFreeDB = require("../models/FoodFree");

const UserDB = require("../models/User");
const saltRounds = 10; 

const autoMiddlware = require("../middleware/checkLoggedInUser");

const isLoggedIn = autoMiddlware.isLoggedIn;
const checkAuthor = autoMiddlware.checkAuthor;


//The User should be able to register/login in the system with token for every one hour

router.post("/Userlogin", (req, res) => {
  const UserEmail = req.body.UserEmail;
  const UserPassword = req.body.UserPassword;


  UserDB.findOne({ UserEmail })
    .select("+UserPassword")
    .then((FoundUser) => {
      if (!FoundUser) {
        const data = "incorrect User Email";
     res.status(401).json({ errorMessage: data });
        return;
      }

      const encryptedPassword = FoundUser.UserPassword;

      bcrypt
        .compare(UserPassword, encryptedPassword)
        .then((response) => {
          if (response) {
            const token = jwt.sign(
              {
                  Userlogin: {
                  UserEmail: FoundUser.UserEmail,
                  id: FoundUser._id,
                },
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "1h",
              }
            );
            res.json({ user: FoundUser, token: token });
          } else {
            res.status(401).json({ errorMessage: "incorrect password" });
          }
        })
        .catch((errorMessage) => {
          res.status(401).json({ errorMessage :'error1'});
        });
    })
    .catch((errorMessage) => {
      res.status(401).json({ errorMessage });
    });
});

router.post("/UserRegister", function (req, res) {
  let UserPassword = req.body.UserPassword;

  if (UserPassword) {
    bcrypt.hash(UserPassword, saltRounds).then((encryptedpassword) => {
      const Userdb = new UserDB({
        FullUserName: req.body.FullUserName,
        UserPassword: encryptedpassword, 
        UserEmail: req.body.UserEmail,
        haveAllergy:req.body.haveAllergy,
        UserFoodFreetype:req.body.UserFoodFreetype,
      });
      Userdb
        .save()
        .then((returnedUserValue) => {
          //here will be the response for result
          console.log("record created in DB");
          const token = jwt.sign(
            { 
              Userlogin: {
                UserEmail: returnedUserValue.UserEmail,
                id: returnedUserValue._id,
              },
            },
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
          );

          res.json({ User: returnedUserValue, token: token });
          console.log(token);
        })
        .catch((error) => {
          console.log();
          console.log(error.message);
          res.status(401).json({ errorMessage: error.message });
        });
    });
  } else {
    res.status(400).json({ errorMessage: "password feield is required" });
  }
});

/* 
- On both side connected Many to many they delete and update 
- The User can register in any of the FoodsFree. 
- The User can list all the FoodsFree he is registered in.
- The User can cancel the registration from the FoodFree.
*/

router.get("/AllFoodsFreeOfUser",isLoggedIn, checkAuthor, (req, res) => {

   const object = res.locals.object;
   const Userlogin = object.Userlogin.id; 
  
    UserDB.findById(Userlogin).populate("userFoodFree").then((UserInfo) => {
  
      res.json({ UserInfo });
  
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  });

router.delete("/UserDeleteFoodFree", isLoggedIn, checkAuthor,(req, res) => {
  
    let userFoodFreeID = req.body.userFoodFreeID; //id for FoodFree will conncted to User
    const object = res.locals.object;  
    const Userlogin = object.Userlogin.id;
 
   // res.json(object);    
  // console.log(object); 

        
      UserDB.findById(Userlogin).populate("userFoodFree").then((UserDBresult) => {
        FoodsFreeDB.findById(userFoodFreeID).then((FoodsFreeresult) => {  
   
      UserDBresult.userFoodFree.pull(userFoodFreeID);

      UserDBresult.save().then(() => {   
   
       FoodsFreeresult.UserFoodAllergy.pull(Userlogin);
       FoodsFreeresult.save().then((savedvalue) => {  

        console.log(" The FoodFree id was delete "); 
        const message = " you are allowd to delete " + " The FoodFree id was delete";
        res.json({ message });     
 
 }).catch((error) => {
  res.status(400).json({ error: error.message });  
    
});

}).catch((error) => {
  res.status(400).json({ error: error.message });  
    
})
}).catch((error) => {
  res.status(400).json({ error: error.message });  
    
})

}).catch((error) => {

  res.status(400).json({ error: error.message });  

})
 });
   

    router.post("/AddFoodFree", isLoggedIn, function (req, res) {

      let userFoodFreeID = req.body.userFoodFree; //id for FoodFree will conncted to User
      const object = res.locals.object;
      const Userlogin = object.Userlogin.id;         
  
      FoodsFreeDB.findById(userFoodFreeID).then((ReturnValueFoodFree) => { 
      UserDB.findById(Userlogin).then((returnedUserValue)=>{
     
       returnedUserValue.userFoodFree.push(userFoodFreeID);  
       
       console.log(returnedUserValue);
       ReturnValueFoodFree.UserFoodAllergy.push(returnedUserValue); 
       ReturnValueFoodFree.save().then(() => {

      returnedUserValue.save().then((uservalue) => { 
        uservalue.populate("userFoodFree").then((valueUserFoodFree) => {  
      res.json({ FoodsFree : valueUserFoodFree });
    })
  }).catch((error) => {
     
      res.status(401).json({ errorMessage: error.message }); 

        })
      }).catch((error) => {
       
        res.status(401).json({ errorMessage: error.message }); 
        
          }).catch((error) => {
       
            res.status(401).json({ errorMessage: error.message }); 
            
              });
    }).catch((error) => {
    
      res.status(401).json({ errorMessage: error.message }); 
      
        });
    });
  });  


  router.post("/updateUser", isLoggedIn, checkAuthor, (req, res) => {

    let UserPassword = req.body.UserPassword;
    //const AdminID = req.session.AdminID;
   
    
    const object = res.locals.object;
   const Userlogin = object.Userlogin.id; 
  
   
    console.log('====================================');
    console.log(Userlogin+" Userlogin");
    console.log('====================================');
    
    
    if (Userlogin) {
      UserDB.findById(Userlogin).then((founduser) => {
        if(founduser._id!=Userlogin){
          res.json( { Error: "You are Not Allowed" });
          //res.render("errorMessage.ejs", { Message: "You are Not Allowed" });
        } else 
        {
          
          if (UserPassword) {
          bcrypt.hash(UserPassword, saltRounds).then((encryptedpassword) => {
      
          UserDB.findById(Userlogin).then((founduser) => {
          founduser.FullUserName= req.body.FullUserName;
          founduser.UserPassword= encryptedpassword;
          founduser.UserEmail=req.body.UserEmail;
          founduser.haveAllergy=req.body.haveAllergy;
          founduser.UserFoodFreetype=req.body.UserFoodFreetype;
         
          founduser.save().then(() => {
            
                  res.json({ Message: "record Updated in DB"});
   
        })
          .catch((error) => {
          
            console.log("The Record not update");
            console.log(error.message);
            res.json({ error: error.message});
    
          });
        
     
      
    });
  });
  } else {
    res.json({ Message: "Password feield is required" });
  
  }
      }
    });
  } else {

      res.json({ Error: "Please Login First" });
  
     }
  
     });
  
       

     router.get("/UserProfile", isLoggedIn, checkAuthor, (req, res) => {



          
    const object = res.locals.object;
    const Userlogin = object.Userlogin.id; 
   
    
     console.log('====================================');
     console.log(Userlogin+" Userlogin");
     console.log('====================================');
    
      if (Userlogin) {
      
        UserDB.findById(Userlogin).then((founduserinfo) => { 
       //res.send(courses);
       res.json({ founduserinfo: [founduserinfo]});
      
      })
      .catch((error) => {
        res.json({ error: [error.message]});
        
      });
      
    } else {
      res.json({ error: ["Please Login First"]});
     
    }
    });      

   
    router.post("/RequestFoodFree", isLoggedIn, checkAuthor, function (req, res) {


    const object = res.locals.object;
    const Userlogin = object.Userlogin.id; 
    
       
    console.log('====================================');
    console.log(Userlogin+" authHeader");
    console.log('====================================');
     
      if (Userlogin) {
        const Food_Free_Name = req.body.Food_Free_Name;
        const BarcodeID = req.body.BarcodeID;
        const FoodDescription  = req.body.FoodDescription;
        const FoodType = req.body.FoodType;
        const AllergyStatus = req.body.AllergyStatus; 
        const  RequestStatus ="false";

       
        UserDB.findById(Userlogin).then((founduser) => {
      
              const NewOrderFreefood = new FoodsFreeDB({   
                Food_Free_Name: Food_Free_Name,
                BarcodeID:BarcodeID,
                FoodDescription: FoodDescription,
                FoodType:FoodType,       
                AllergyStatus :AllergyStatus,    
                RequestStatus :RequestStatus,
                UserFoodAllergy: founduser,       
              });
    
              //to save the data on DB from form
              NewOrderFreefood.save().then((Foodsavedvalue) => {
                founduser.userFoodFree.push(Foodsavedvalue);
                founduser.save().then((usersavedvalue) => {
               
                  console.log("record created in DB");
                  res.json({ Message: "Record Created in DB", Data:usersavedvalue});
          
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
   
    }
    });

  

    router.get("/ListAllFoodfreeforalluser",isLoggedIn, checkAuthor ,(req, res) => {

      const object = res.locals.object;
      const Userlogin = object.Userlogin.id; 
       
   
      console.log('====================================');
      console.log(Userlogin+" authHeader");
      console.log('====================================');
    
      if (Userlogin) {
         
        FoodsFreeDB.find().then((FoodFreeDB) => { 

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
         

  
module.exports = router;


