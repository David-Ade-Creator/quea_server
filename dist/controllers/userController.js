"use strict";

const User = require("../models/userModel");

exports.usersController = async (req, res) => {
  const users = await User.find({});

  if (users) {
    res.send(users);
  } else {
    res.status(404).send({
      message: "Unable to fetch users"
    });
  }

  ;
};

exports.readUserProfileController = async (req, res) => {
  const profile = await User.findOne({
    _id: req.params.id
  });

  if (profile) {
    res.send(profile);
  } else {
    res.status(404).send({
      message: "Profile Not Found."
    });
  }
};

exports.updateUserProfileController = async (req, res) => {
  const profile = await User.findById(req.params.id);

  if (profile) {
    profile.info = {
      education: req.body.education,
      country: req.body.country,
      state: req.body.state,
      address: req.body.address
    };
  }

  profile.save((err, info) => {
    if (info) {
      res.send(info);
    } else {
      res.status(404).send({
        message: "Profile Not Found."
      });
    }
  });
};

exports.profilePhotoController = async (req, res) => {
  const profile = await User.findById(req.params.id);

  if (profile) {
    profile.info = {
      photo: req.body.photo
    };
  }

  profile.save((err, info) => {
    if (info) {
      res.send(info);
    } else {
      res.status(404).send({
        message: "Profile Not Found."
      });
    }
  });
};