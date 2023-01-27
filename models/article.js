const mongoose = require("mongoose");
const Author = require("./author");
const Category = require("./category");
const { Schema } = mongoose;

const articleSchema = new Schema({
  title: String,
  seoTitle: String,
  description: String,
  keywords: String, 
  tagline: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  slug: String,
  reads: Number,
  heroImage: String,
  content: String,
  datePublished: String,
  dateLastUpdated: String,
});

// ----- When a article is published then it is even added to the authors list of articles -----//
articleSchema.post("save", async (article) => {
  if (article.author) {
    await Author.findOneAndUpdate(
      { _id: article.author._id },
      { $push: { articles: article._id } }
    );
  }
  if (article.category) {
    await Category.findOneAndUpdate(
      { _id: article.category._id },
      { $push: { articles: article._id } }
    );
  }
});

// ----- When the article gets Deleted then it is even deleted from the authors list of articles -----//
articleSchema.post("findOneAndDelete", async (article) => {
  if (article.author) {
    await Author.findOneAndUpdate(
      { _id: article.author._id },
      { $pull: { articles: article._id } }
    );
  }
  if (article.category) {
    await Category.findOneAndUpdate(
      { _id: article.category._id },
      { $pull: { articles: article._id } }
    );
  }
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
