const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: {
      index: {
        unique: true,
      },
    },
  },
  link: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  summary: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
