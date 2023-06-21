const express = require("express");

const router = express.Router();
const autoMiddlware = require("../middleware/checkLoggedInUser");

const isLoggedIn = autoMiddlware.isLoggedIn;
const checkAuthor = autoMiddlware.checkAuthor;

const saltRounds = 10;
const dotenv= require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();

const UserDB = require("../models/User");
const FoodsFreeDB = require("../models/FoodFree");
const CommunityDB = require("../models/Community");


//the action will be to add new Food
router.post("/AddComment",isLoggedIn, checkAuthor, function (req, res) {
 

    const object = res.locals.object;

    console.log('==================userlogin==================')
    
    const userlogin = object.Userlogin.id; 
  

  console.log('====================================');
  console.log(userlogin+" userlogin");
  console.log('====================================');
  
   
    if (userlogin) {

        const TopicName = req.body.TopicName;
        const ContentName  = req.body.ContentName;
    
        
  
      UserDB.findById(userlogin).then((foundUser) => {

            const NewComment = new CommunityDB({
                TopicName: TopicName,
                ContentName: ContentName,       
              CommUser: foundUser,       
            });
  
            //to save the data on DB from form
  
    
            NewComment.save().then((Returndcomment) => {
                foundUser.UserComm.push(Returndcomment);
                foundUser.save().then((savedvalue) => {
          
                console.log("record created in DB");
                res.json({ Message: "Record Created in DB", Data:savedvalue});
       
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
     
  router.delete("/DeleteComment/:userCommunityID", isLoggedIn, checkAuthor,(req, res) => {
  
    const userCommunityID = req.params.userCommunityID;

    console.log(userCommunityID+" "+ "userCommunityID");


  
    const object = res.locals.object;

    console.log('==================userlogin==================')
    
    const Userlogin = object.Userlogin.id; 
  

  console.log('====================================');
  console.log(Userlogin+" userlogin");
  console.log('===================================='+" founduser.UserComm");

        
      UserDB.findById(Userlogin).populate("UserComm").then((UserDBresult) => {
        CommunityDB.findById(userCommunityID).then((userCommunityresult) => {  
   
      UserDBresult.UserComm.pull(userFoodFreeID);

      UserDBresult.save().then(() => {   
   
        userCommunityresult.CommUser.pull(Userlogin);
        userCommunityresult.save().then((savedvalue) => {  

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
   

 router.post("/updateComment/:userCommunityID", isLoggedIn, checkAuthor, (req, res) => {


    const userCommunityID = req.params.userCommunityID;
    
    console.log(userCommunityID+" "+ "userCommunityID");
    
   const object = res.locals.object;
   const Userlogin = object.Userlogin.id; 

   const TopicName = req.body.TopicName;
   const ContentName  = req.body.ContentName;
  
                     
  
   
    console.log('====================================');
    console.log(TopicName+" Userlogin");
    console.log('====================================');
    
       
    if (Userlogin) {
      UserDB.findById(Userlogin).then((founduser) => {
        if(founduser._id!=Userlogin){
          res.json( { Error: "You are Not Allowed" });    
         
        } else 
        {
          
        CommunityDB.findById(userCommunityID).then((foundComment) => {

            foundComment.TopicName = TopicName;
            foundComment.ContentName= ContentName;       
     
         
         
            foundComment.save().then(() => {
            
                  res.json({ Message: "record Updated in DB"});
   
        }).catch((error) => {
          
           
            console.log(error.message);
            res.json({ error: error.message});
    
          });
        
     
      
    }).catch((error) => {
          
     
        console.log(error.message);
        res.json({ error: error.message});

      });

      }
    });
  } else {

      res.json({ Error: "Please Login First" });
  
     }
  
     });




     //One Comment will display
router.get("/DisplayComment/:userCommunityID",isLoggedIn, checkAuthor, (req, res) => {

    
    const userCommunityID = req.params.userCommunityID;
    
    console.log(userCommunityID+" "+ "userCommunityID");
    
   const object = res.locals.object;
   const Userlogin = object.Userlogin.id; 

 
      
        if (Userlogin) {
        
          CommunityDB.findById(userCommunityID).then((Communityvalue) => { 
            res.json({ Communityvalue : [Communityvalue]});
         
        })
        .catch((error) => {
          res.json({ error: [error.message] });
        
        });
      
      } else {
        res.json({ error: error.message });
      }
      }); 
      

//All the Comments will display
      router.get("/DisplayAllComment",isLoggedIn, checkAuthor ,(req, res) => {

        const object = res.locals.object;
        const Userlogin = object.Userlogin.id; 
      
        if (Userlogin) {
        
          CommunityDB.find().then((Communityvalue) => { 
            res.json({ data : [Communityvalue]});
       
        })
        .catch((error) => {
          res.json({ error: error.message });
   
        });
      
      } else {
        res.json({ error: error.message });
      }
      });  
            

  









module.exports = router;
 