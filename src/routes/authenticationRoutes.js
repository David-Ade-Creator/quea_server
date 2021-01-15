const express = require('express')
const router = express.Router()

// Load Controllers
const {
   createAccountController,
   signinAccountController,
   sendResetPasswordLinkController,
   resetPasswordController,
   googleLoginController,
  // getSingleUserController,
   facebookLoginController,
   readUserProfileController,
   updateUserProfileController,
   profilePhotoController,
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

//router.get("/user/:id", readUserProfileController);

router.post("/facebookLogin", facebookLoginController);

//router.put("/user/:id/updateprofile", updateUserProfileController);

//router.put("/user/:id/profilephoto", profilePhotoController);

module.exports = router;