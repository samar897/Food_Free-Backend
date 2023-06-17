const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const AdminDB = require("../models/Admin");

const saltRounds = 10;
const dotenv= require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();


/*
- the Admin  able to register in the system. 
- the Admin  able to login.
- Every user have there own session.
*/

//(Done) /Adminlogin
router.post("/Adminlogin", (req, res) => {


  const AdminEmail = req.body.AdminEmail;
  const AdminPassword = req.body.AdminPassword;
  const AdminID="648d708613b8b9635d8ab4dd";

  console.log()



  AdminDB.findOne({ AdminEmail }) 
    .select("+AdminPassword")
    .then((foundAdmin) => {
      if (!foundAdmin) {
        const data = "incorrect Admin Email";
        res.json( { error: data});
       // res.render("errorMessage.ejs", { data });
        return;
      }

      const encryptedPassword = foundAdmin.AdminPassword;
      bcrypt.compare(AdminPassword, encryptedPassword).then((response) => {
          if (response) {

            req.session.AdminID=foundAdmin._id;

            console.log(req.session.AdminID);
            if(req.session.AdminID==AdminID){
             // res.redirect("/PrincipalRouter/PrincipalAdminList");
             res.json({ Admin: response, AdminID :req.session.AdminID});
            }
            else{
             // res.redirect("/in/OneAdminInfo");
             res.json({ Message: "Not allwed"});
            }
           
          } else {
            res.json( { error: "error.message" });
        
          }
        })
        .catch((error) => {
          res.json( { error: error.message });
        });
    })
    .catch((error) => {
      res.json( { error: error.message });
     // res.render("errorMessage.ejs", { data: error.message });
    });
});

//(Done) /PostAdminRegister
router.post("/PostAdminRegister", function (req, res) {
  let AdminPassword = req.body.AdminPassword;

  if (AdminPassword) {
    bcrypt.hash(AdminPassword, saltRounds).then((encryptedpassword) => {
      const Admin = new AdminDB({
        FullAdminName: req.body.FullAdminName,
        AdminPassword: encryptedpassword,
        AdminEmail: req.body.AdminEmail,
      });
      Admin
        .save()  
        .then((returnedValue) => {
          //here will be the response for result
          console.log("record created in DB");
          req.session.AdminID=returnedValue._id;
          res.json({ Admin: returnedValue, AdminID :req.session.AdminID});
         // res.redirect("/in/OneAdminInfo");
          console.log(returnedValue);
        })
        .catch((error) => {
          console.log();
          console.log(error.message);
          res.status(401).json( error.message );
        });
    });
  } else {
    res.status(401).json( { Error: "password feield is required" });
    //res.render("errorMessage.ejs", { data: "password feield is required" });
    
  }
});

router.get("/Logout", (req, res) => {
  req.session.destroy();
  res.redirect("/in/login");
});


//    /:AdminID2 (Done)
router.delete("/AdminDelete", (req, res) => {

  const authHeaderAdminID = req.headers.authorization;
 
  //console.log(AdminID + " AdminID ");
  console.log('====================================');
  console.log(authHeaderAdminID+" authHeader");
  console.log('====================================');
  

    //const AdminID2 = req.params.AdminID2;
    //const AdminIDsession=req.session.AdminID;
    const DBAdminID="648d9caa8d929e0282b4c83b";

    console.log(authHeaderAdminID +" authHeaderAdminID");
   
    if (authHeaderAdminID) {
    if(authHeaderAdminID==DBAdminID){
      
        AdminDB.findByIdAndDelete(authHeaderAdminID).then(() => { 
       //res.send("Your Account is Deleted");
       res.json({ Message: "Your Account is Deleted"});
       console.log("Deleted");
       //res.redirect("/PrincipalRouter/PrincipalAdminList");
      })
      .catch((error) => {
        res.json({ error: error.message});
       // res.render("errorMessage.ejs", { data: error.message });
      });
  
    } else {

      res.json({ error: "You are Not Allowed"});
       // res.render("errorMessage.ejs", { data: "You are Not Allowed" });
      
      }

}else {
  res.render("errorMessage.ejs", { data: "/in/login" });
   //9* res.redirect("/in/login");
  }
  
  });

    //The Admin can update his/her or he can delete the account :AdminID (/updateAdmin (Done)

router.post("/updateAdmin", (req, res) => {

  let AdminPassword = req.body.AdminPassword;
 
  //const AdminID = req.session.AdminID;
 
  const AdminID = req.headers.authorization;
 
  //console.log(AdminID + " AdminID ");
  console.log('====================================');
  console.log(AdminID+" authHeader");
  console.log('====================================');
  
  
  if (AdminID) {
    AdminDB.findById(AdminID).then((foundAdmin) => {
      if(foundAdmin._id!=AdminID){
        res.json( { Error: "You are Not Allowed" });
        //res.render("errorMessage.ejs", { Message: "You are Not Allowed" });
      } else 
      {
        
        if (AdminPassword) {
          bcrypt.hash(AdminPassword, saltRounds).then((encryptedpassword) => {
    
       AdminDB.findById(AdminID).then((foundAdmin) => {
        foundAdmin.FullAdminName = req.body.FullAdminName;
        foundAdmin.AdminPassword=encryptedpassword;
        foundAdmin.AdminEmail=req.body.AdminEmail;
 
             foundAdmin.save().then(() => {
          
                res.json({ Message: "record Updated in DB"});
 
      })
        .catch((error) => {
        
          console.log("The Record not update");
          console.log(error.message);
          res.json({ Message: "The Record not update"});
  
        });
      
   
    
  });
});
} else {
  res.json({ Message: "Password feield is required" });

}
    }
  });
} else {
    // res.redirect("/in/login");
    res.json({ Error: "Please Login First" });

   }

   });


  //*******************Done***************************************** */
router.get("/DisplayAdminInfo", (req, res) => {

//const AdminID=req.session.AdminID;
const AdminID = req.headers.authorization;
  //affect all the read and add on the table, the find funcation promise asy fun  
if (AdminID) {
 AdminDB.findById(AdminID)
 .populate("AdminFoodFreeID")
 .then((Admin) => { 
  //res.send(Admin);
  res.json({ Message: [Admin]});
})
.catch((error) => {
  res.json({ error: error.message});
});

}
else
{
  res.json({ Message: "redirect to another page "});
}

});
  






//************************************************************ */

router.get("/AdminUpdate/:AdminID2", (req, res) => {

  const AdminID2 = req.params.AdminID2;
  //const AdminID=req.session.AdminID;
  const AdminID = req.headers.authorization;

  console.log(AdminID2 + " ");
  console.log(AdminID + " ");

if (AdminID) {
if(AdminID2==AdminID){

res.render("AdminRegister.ejs",{data:AdminID});

} else{
res.render("errorMessage.ejs", { data: "You are Not Allowed" });

}
} else {
  res.render("errorMessage.ejs", { data: "Please Login First" });
}
});

router.get("/getCoursesUpdate/:CourseID", (req, res) => {
  const CourseID = req.params.CourseID;
  const AdminID = req.session.AdminID;
  console.log(CourseID);
  console.log(AdminID);

  if (AdminID) {
    Courses.findById(CourseID).then((foundAdmin) => {
      if(foundAdmin.InstCor!=AdminID){
        res.render("errorMessage.ejs", { data: "You are Not Allowed" });
      } else {
        res.render("AddCourses.ejs",{data: CourseID});
      }
});

} else {
  res.redirect("/in/login");
}
});


  
router.get("/getAdminRegister", (req, res) => {
  res.render("AdminRegister.ejs");
});


router.get("/", (req, res) => {
  res.render("AdminLoginForm.ejs");
});
router.get("/login", (req, res) => {
  res.render("AdminLoginForm.ejs");
});




module.exports = router;



