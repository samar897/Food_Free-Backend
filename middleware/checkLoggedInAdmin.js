//This File Responsible to check from User if he logged in or not and if he/she authorized

const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");

const checkAuthor = (req, res, next) => {
	try {

		const authHeader = req.headers.authorization;
		const token = authHeader.split(" ")[1];
		const object = jwt.verify(token, process.env.JWT_SECRET);
		res.locals.object = object;

		
	  const adminlogin = object.adminlogin.id; 


		//const usercourseID = req.body.usercourseID;

		Admin.findById(adminlogin) 
			.then((foundadmin) => {	

				//console.log( foundadmin._id + "foundadmin._id");
				//console.log(adminlogin + " userlogin ");

				if (foundadmin._id == adminlogin ) {
					next();
				} else {
					res.json({ errorMessage: "unauthorized" });
				}
			
			})
			.catch((error) => {
				res.json({ errorMessage: error.message });
			});
	} catch (error) {
		res.json({ errorMessage: error.message });
	}
};

// ======= MIDDLEWARE ======= //
const isLoggedIn = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader.split(" ")[1];
		const object = jwt.verify(token, process.env.JWT_SECRET);
		res.locals.object = object;
		next();
	} catch (err) {
		res.json({ errorMessage: err });
	}
};



module.exports = {isLoggedIn:isLoggedIn, checkAuthor:checkAuthor};

