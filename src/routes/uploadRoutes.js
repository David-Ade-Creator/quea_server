const express = require("express");
const router = express.Router();

// Load Controllers
const { uploadController,uploadS3 } = require("../controllers/uploadController.js");

router.post("/upload/s3", uploadS3.single("file"), uploadController);

module.exports = router;
