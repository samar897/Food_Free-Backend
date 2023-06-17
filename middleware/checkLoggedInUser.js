//This File Responsible to check from User if he logged in or not and if he/she authorized

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const checkAuthor = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader.split(" ")[1];
		const object = jwt.verify(token, process.env.JWT_SECRET);
		res.locals.object = object;

		
	const userlogin = object.Userlogin.id; 


		



		//const usercourseID = req.body.usercourseID;

		User.findById(userlogin) 
			.then((founduser) => {	

				console.log( founduser._id + "founduser._id");
				console.log(userlogin + " userlogin ");

				if (founduser._id == userlogin ) {
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

