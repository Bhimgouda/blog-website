const { ref } = require("joi");
const mongoose = require("mongoose");
const Author = require("./author");
const { Schema } = mongoose;

const articleSchema = new Schema({
  title: String,
  description: String,
  keywords: String, // May be I have to change this to a string
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
  },
  heroImage: String,
  content: String,
});

articleSchema.post("findOneAndDelete", async (article) => {
  if (article.author) {
    const data = await Author.findOneAndUpdate(
      { _id: article.author._id },
      { $pull: { articles: article._id } }
    );
  }
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
