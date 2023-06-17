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
          res.status(401).json({ errorMessage });
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
        FirstUserName: req.body.FirstUserName,
        SecondUserName: req.body.SecondUserName,
        UserPassword: encryptedpassword, 
        UserEmail: req.body.UserEmail,
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
          //res.render("InstructorLoginForm.ejs");
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
    //console.log(object); 

        
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
  

  


  
module.exports = router;


