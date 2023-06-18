const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const AdminDB = require("../models/Admin");


const dotenv= require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();


const FoodsFreeDB = require("../models/FoodFree");

const UserDB = require("../models/User");
const saltRounds = 10; 

const autoMiddlware = require("../middleware/checkLoggedInAdmin");

const isLoggedIn = autoMiddlware.isLoggedIn;
const checkAuthor = autoMiddlware.checkAuthor;


/*
- the Admin  able to register in the system. 
- the Admin  able to login.
- Every user have there own token.
*/

//(Done) /Adminlogin
router.post("/Adminlogin", (req, res) => {

  const AdminEmail = req.body.AdminEmail;
  const AdminPassword = req.body.AdminPassword;
  const AdminID="648ed13223a9649c600a94bb";

  console.log(AdminID+" AdminID")


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

            const token = jwt.sign(
              {
                adminlogin: {
                  AdminEmail: foundAdmin.AdminEmail,
                  id: foundAdmin._id,
                },
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "1h",
              }
            );
      

            console.log(foundAdmin._id);
            if(foundAdmin._id==AdminID){
             
             res.json({ Admin: foundAdmin, token: token });
            }
            else{
            console.log(adminlogin+ " adminlogin")
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

//(Done) /PostAdminRegister note: the PostAdminRegister will only for one time submit for only one Admin

/*
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
        .then((foundAdmin) => {
          //here will be the response for result
          console.log("record created in DB");
          const token = jwt.sign(
            {
              adminlogin: {
                AdminEmail: foundAdmin.AdminEmail,
                id: foundAdmin._id,
              },
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );
          res.json({ Admin: foundAdmin, token: token });
          console.log(foundAdmin);
        })
        .catch((error) => {
          console.log();
          console.log(error.message);
          res.status(401).json( error.message );
        });
    });
  } else {
    res.status(401).json( { Error: "password feield is required" });
    
  }
});

*/

//    /:AdminID2 (Done)
router.delete("/AdminDelete" ,isLoggedIn, checkAuthor, (req, res) => {

  const object = res.locals.object;
  const adminlogin = object.adminlogin.id; 
 

  
 
  //console.log(AdminID + " AdminID ");
  console.log('====================================');
  console.log(adminlogin+" authHeader");
  console.log('====================================');
  

    //const AdminID2 = req.params.AdminID2;
    //const AdminIDsession=req.session.AdminID;
    const DBAdminID="648d9caa8d929e0282b4c83b";

    console.log(adminlogin +" authHeaderAdminID");
   
    if (adminlogin) {
    if(adminlogin==DBAdminID){
      
        AdminDB.findByIdAndDelete(adminlogin).then(() => { 
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

router.post("/updateAdmin",isLoggedIn, checkAuthor, (req, res) => {

  let AdminPassword = req.body.AdminPassword;
 

  const object = res.locals.object;
  const adminlogin = object.adminlogin.id; 
 

  
 
  //console.log(AdminID + " AdminID ");
  console.log('====================================');
  console.log(adminlogin+" authHeader");
  console.log('====================================');
  
  
  
  if (adminlogin) {
    AdminDB.findById(adminlogin).then((foundAdmin) => {
      if(foundAdmin._id!=adminlogin){
        res.json( { Error: "You are Not Allowed" });
        //res.render("errorMessage.ejs", { Message: "You are Not Allowed" });
      } else 
      {
        
        if (AdminPassword) {
          bcrypt.hash(AdminPassword, saltRounds).then((encryptedpassword) => {
    
       AdminDB.findById(adminlogin).then((foundAdmin) => {
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
router.get("/DisplayAdminInfo",isLoggedIn, checkAuthor ,(req, res) => {




const object = res.locals.object;
const AdminID = object.adminlogin.id; 




//console.log(AdminID + " AdminID ");
console.log('====================================');
console.log(adminlogin+" authHeader");
console.log('====================================');

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

router.get("/AdminUpdate/:AdminID2",isLoggedIn, checkAuthor, (req, res) => {

  const AdminID2 = req.params.AdminID2;
  
  
  const object = res.locals.object;
  const AdminID = object.adminlogin.id; 
 

  
 
  //console.log(AdminID + " AdminID ");
  console.log('====================================');
  console.log(adminlogin+" authHeader");
  console.log('====================================');
  

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



