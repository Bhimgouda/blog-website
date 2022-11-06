const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  title: String,
  description: String,
  articles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
