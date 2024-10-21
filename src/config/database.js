const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://jayluhar:S85zKsoq787q564e@nodejs.olekk.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
