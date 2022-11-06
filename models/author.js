const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const authorSchema = new Schema({
  name: String,
  email: String,
  password: String,
  articles: [{ type: Schema.Types.ObjectId, ref: "Article" }],
});

authorSchema.statics.authenticate = async (email, password) => {
  const registeredAuthor = await Author.findOne({ email });
  if (!registeredAuthor) return false;
  const isValid = await bcrypt.compare(password, registeredAuthor.password); // Bcrypt resoponds with promises
  return isValid ? registeredAuthor : false;
};

authorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12); // Bcrypt resoponds with promises
  next();
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
