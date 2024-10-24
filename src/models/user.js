const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email not valid " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      min: 6,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender is not valid!");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalud PhotoUrl: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of user!",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
