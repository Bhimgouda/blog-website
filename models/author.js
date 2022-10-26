const mongoose = require("mongoose");
const { Schema } = mongoose;

const authorSchema = new Schema({
  name: String,
  articles: [{ type: Schema.Types.ObjectId, ref: "Article" }],
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
