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
module.exports = { validateSignUpData };
