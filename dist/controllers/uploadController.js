"use strict";

const multer = require('multer');

const multerS3 = require('multer-s3');

const aws = require('aws-sdk');

const config = require('../config');

aws.config.update({
  accessKeyId: config.ACCESSBUCKETKEY,
  secretAccessKey: config.SECRETACCESSBUCKETKEY
});
const s3 = new aws.S3();
const storageS3 = multerS3({
  s3,
  bucket: 'reservation-bucket2202',
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,

  key(req, file, cb) {
    cb(null, file.originalname);
  }

});
exports.uploadS3 = multer({
  storage: storageS3
});

exports.uploadController = (req, res) => {
  res.send(req.file.location);
};