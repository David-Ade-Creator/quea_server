"use strict";

const User = require("../models/userModel");

const config = require("../config");

const {
  OAuth2Client
} = require("google-auth-library");

const fetch = require("node-fetch");

const jwt = require("jsonwebtoken");

const {
  errorHandler
} = require("../helpers/dbErrorHandling");

const sgMail = require("@sendgrid/mail");

const {
  validationResult
} = require("express-validator");

const {
  generateConfirmationToken,
  generateAccessToken
} = require("../util");

sgMail.setApiKey(config.MAIL_KEY);

exports.createAccountController = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password
  } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({
      errors: firstError
    });
  } else {
    User.findOne({
      email
    }).exec((err, doc) => {
      if (doc) {
        return res.status(400).json({
          errors: "Email is taken"
        });
      }
    });
    const token = jwt.sign({
      firstname,
      lastname,
      email,
      password
    }, config.CONFIRMATION_TOKEN_SECRET, {
      expiresIn: "1d"
    });
    const emailData = {
      from: config.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `
                    <h1>Please confirm you email</h1>
                    <p>Please click on this link <a href="${config.CLIENT_URL}/users/activateaccount/${token}">Activate Your Account</a> to 
                    confirm you email address and activate your account</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${config.CLIENT_URL}</p>
                 `
    };
    sgMail.send(emailData).then(sent => {
      return res.json({
        message: `Confirmation mail has been sent to ${email}.`
      });
    }).catch(error => {
      return res.json({
        errors: "here"
      });
    });
  }
};

exports.signinAccountController = async (req, res) => {
  const {
    email,
    password
  } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({
      errors: firstError
    });
  } else {
    // check if user exist
    User.findOne({
      email
    }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          errors: "User with that email does not exist. Please signup"
        });
      } //authenticate


      if (!user.authenticate(password)) {
        return res.status(400).json({
          errors: "Email and password do not match"
        });
      }

      return res.json({
        data: {
          user: user,
          accessToken: jwt.sign({
            user
          }, config.CONFIRMATION_TOKEN_SECRET, {
            expiresIn: "1d"
          })
        }
      });
    });
  }
};

exports.activateAccountController = async (req, res) => {
  const token = req.params.id;

  if (token) {
    jwt.verify(token, config.CONFIRMATION_TOKEN_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).json({
          errors: "Expired Activation Link. Signup for a new link"
        });
      } else {
        const {
          firstname,
          lastname,
          email,
          password
        } = jwt.decode(token);
        const user = new User({
          firstname,
          lastname,
          email,
          password
        });
        user.save((err, user) => {
          if (err) {
            return res.status(401).json({
              errors: errorHandler(err)
            });
          } else {
            return res.json({
              message: "Your account has been successfully Activated, Login to continue."
            });
          }
        });
      }
    });
  } else {
    return res.json({
      errors: "Unable to activate account, please signup again"
    });
  }
};

exports.sendResetPasswordLinkController = async (req, res) => {
  const {
    email
  } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({
      errors: firstError
    });
  } else {
    User.findOne({
      email
    }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User with that email does not exist"
        });
      }

      const token = jwt.sign({
        _id: user._id
      }, config.JWT_RESET_PASSWORD, {
        expiresIn: "30m"
      });
      const emailData = {
        from: config.EMAIL_FROM,
        to: email,
        subject: `Password Reset Link`,
        html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${config.CLIENT_URL}/users/password/reset/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${config.CLIENT_URL}</p>
                `
      };
      return user.updateOne({
        resetPasswordLink: token
      }, (error, success) => {
        if (error) {
          return res.status(400).json({
            error: "Database connection error on user password forgot request"
          });
        }

        sgMail.send(emailData).then(sent => {
          return res.json({
            message: `Email has been sent to ${email}. Follow the instruction to activate your account`
          });
        }).catch(error => {
          return res.json({
            message: error.message
          });
        });
      });
    });
  }
};

exports.resetPasswordController = async (req, res) => {
  const {
    resetPasswordLink,
    newPassword
  } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({
      errors: firstError
    });
  } else {
    if (resetPasswordLink) {
      jwt.verify(resetPasswordLink, config.JWT_RESET_PASSWORD, function (err, decoded) {
        if (err) {
          return res.status(400).json({
            error: "Expired link. Try again"
          });
        }

        User.findOne({
          resetPasswordLink
        }, (err, user) => {
          if (user) {
            user.password = newPassword;
            user.resetPasswordLink = "";
            user.save((err, result) => {
              if (err) {
                return res.status(400).json({
                  error: "Error resetting user password"
                });
              }

              res.json({
                message: `Great! Now you can login with your new password`
              });
            });
          } else {
            return res.status(400).json({
              error: "Something went wrong. Try later"
            });
          }
        });
      });
    }
  }
};

const client = new OAuth2Client(config.GOOGLE_CLIENT); //google login

exports.googleLoginController = async (req, res) => {
  const idToken = req.body;
  client.verifyIdToken({
    idToken: idToken.tokenId,
    audience: config.GOOGLE_CLIENT
  }).then(response => {
    const {
      email_verified,
      name,
      email
    } = response.payload;

    if (email_verified) {
      User.findOne({
        email
      }).exec((err, user) => {
        if (user) {
          const token = jwt.sign({
            _id: user._id
          }, config.JWT_SECRET, {
            expiresIn: "7d"
          });
          const {
            _id,
            email,
            firstname
          } = user;
          return res.json({
            token,
            user: {
              _id,
              email,
              firstname
            }
          });
        } else {
          let password = email + config.JWT_SECRET;
          user = new User({
            firstname: name,
            email,
            password
          });
          user.save((err, data) => {
            if (err) {
              console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
              return res, status(400).json({
                error: "User signup failed with google"
              });
            }

            const token = jwt.sign({
              _id: data._id
            }, config.JWT_SECRET, {
              expiresIn: "7d"
            });
            const {
              _id,
              email,
              firstname
            } = data;
            return res.json({
              token,
              user: {
                _id,
                email,
                firstname
              }
            });
          });
        }
      });
    } else {
      return res.status(400).json({
        error: "Google login failed. Try again"
      });
    }
  });
};

exports.facebookLoginController = async (req, res) => {
  console.log("FACEBOOK LOGIN REQ BODY", req.body);
  const {
    userID,
    accessToken
  } = req.body;
  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;
  return fetch(url, {
    method: "GET"
  }).then(response => response.json()) // .then(response => console.log(response))
  .then(response => {
    const {
      email,
      name
    } = response;
    User.findOne({
      email
    }).exec((err, user) => {
      if (user) {
        const token = jwt.sign({
          _id: user._id
        }, config.JWT_SECRET, {
          expiresIn: "7d"
        });
        const {
          _id,
          email,
          name
        } = user;
        return res.json({
          token,
          user: {
            _id,
            email,
            name
          }
        });
      } else {
        let password = email + config.JWT_SECRET;
        user = new User({
          name,
          email,
          password
        });
        user.save((err, data) => {
          if (err) {
            console.log("ERROR FACEBOOK LOGIN ON USER SAVE", err);
            return res.status(400).json({
              error: "User signup failed with facebook"
            });
          }

          const token = jwt.sign({
            _id: data._id
          }, process.env.JWT_SECRET, {
            expiresIn: "7d"
          });
          const {
            _id,
            email,
            name
          } = data;
          return res.json({
            token,
            user: {
              _id,
              email,
              name
            }
          });
        });
      }
    });
  }).catch(error => {
    res.json({
      error: "Facebook login failed. Try later"
    });
  });
};