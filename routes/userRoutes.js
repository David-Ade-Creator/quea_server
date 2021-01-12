const express = require('express')
const router = express.Router()

// Load Controllers
const {
   usersController,
   readUserProfileController,
   updateUserProfileController,
   profilePhotoController,
} = require("../controllers/userController.js");

router.get("/users", usersController)

router.get("/users/:id", readUserProfileController);

router.put("/users/:id/updateprofile", updateUserProfileController);

router.put("/users/:id/profilephoto", profilePhotoController);

module.exports = router;