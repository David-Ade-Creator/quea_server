const mongoose = require("mongoose");
const crypto = require("crypto");
// user schema
const userScheama = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    firstname: {
      type: String,
      trim: true,
      required: true,
    },
    lastname: {
      type: String,
      trim: true,
    },
    info: {
      description: {
        type: String,
        default: ''
      },
      photo: {
        type: String,
        default: ''
      },
      education: {
        type: String,
        default: ''
      },
        country: {
          type: String,
          default: ''
        },
        state: {
          type: String,
          default: ''
        },
        address: {
          type: String,
          default: ''
        },
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    resetPasswordLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for user's full name
userScheama
	.virtual("fullName")
	.get(function () {
		return this.firstname + " " + this.lastname;
	});


// virtual
userScheama
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
userScheama.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

module.exports = mongoose.model("User", userScheama);
