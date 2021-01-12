const jwt = require("jsonwebtoken");
const config = require("./config.js");

exports.generateAccessToken =  
	async (id) => {
		try{
			return jwt.sign({id}, config.ACCESS_TOKEN_SECRET,{ expiresIn: "3d"});
		}catch(err){
			console.log(err);
		}
	};
  
exports.generateConfirmationToken =  
	async (id) => {
		try{
			return jwt.sign({id}, config.CONFIRMATION_TOKEN_SECRET , {expiresIn: "1d"});
		}catch(e){
			console.log(e);
		}
	};


exports.generateResetToken =  
	async (id) => {
		try{
			return jwt.sign({id}, process.env.RESET_TOKEN_SECRET, {expiresIn: "1d"});
		}catch(e){
			console.log(e);
		}
	};
