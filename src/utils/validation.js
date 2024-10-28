const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Please enter your name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter a valid EmailId");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const isAllowedEditeFields = [
    "firstName",
    "lastName",
    "password",
    "photoUrl",
    "skills",
    "about",
    "age",
    "gender",
  ];

  const isEditAllowed = Object.keys(req.body).every((fields) =>
    isAllowedEditeFields.includes(fields)
  );

  return isEditAllowed;
};
module.exports = { validateSignUpData, validateEditProfileData };
