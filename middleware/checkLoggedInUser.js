//This File Responsible to check from User if he logged in or not and if he/she authorized

const jwt = require("jsonwebtoken");

const UserDB = require("../models/User");

const checkAuthor = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader.split(" ")[1];
		const object = jwt.verify(token, process.env.JWT_SECRET);
		res.locals.object = object;

		console.log(object+" object"+" res.locals.object" + res.locals.object);
		
	     const Userlogin = object.Userlogin.id; 
		 console.log(Userlogin+" هنا ");

 

		//const usercourseID = req.body.usercourseID;
		UserDB.findById(Userlogin) 
			.then((founduser) => {	


				//console.log( founduser._id + "founduser._id");
				//console.log(userlogin + " userlogin ");

				if (founduser._id == Userlogin ) {
					next();
				} else {
					res.json({ errorMessage: "unauthorized" });
				}
			
			})
			.catch((error) => {
				console.log(Userlogin);
				console.log(" here 1 " );
				res.json({ errorMessage: error.message });
			});
	} catch (error) {
		console.log(" here 2 ");
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

