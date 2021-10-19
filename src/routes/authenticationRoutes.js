const express = require('express')
const router = express.Router();

const {
   createAccountController,
   signinAccountController,
   sendResetPasswordLinkController,
   resetPasswordController,
   googleLoginController,
   facebookLoginController,
   activateAccountController,
} = require("../controllers/authController.js");

const  {
   validSign,
   validLogin,
   forgotPasswordValidator,
   resetPasswordValidator
} = require("../helpers/valid");


router.post("/signup", validSign ,createAccountController);

router.post("/signin", validLogin, signinAccountController);

router.post("/:id/activate", activateAccountController);

router.put("/sendPasswordLink", forgotPasswordValidator, sendResetPasswordLinkController );

router.put("/resetPassword", resetPasswordValidator, resetPasswordController);

router.post("/googleLogin", googleLoginController);

router.post("/facebookLogin", facebookLoginController);

module.exports = router;