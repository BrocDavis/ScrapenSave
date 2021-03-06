const express = require("express");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = process.env.PORT || 3000;
const app = express();

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.set('useUnifiedTopology', true);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/", function (req, res) {
  db.Article.find({}).lean()
    .then(function (article) {
      var hbsObject = {
        articles: article
      };
      res.render("index", hbsObject);
    })
})

app.get("/saved", function (req, res) {
  db.Article.find({ saved: true }).lean()
    .populate("notes")
    .exec(function (error, articles) {
      var hbsObject = {
        article: articles
      };
      res.render("saved", hbsObject);
    });
});

app.get("/scrape", function (req, res) {

  axios.get("https://www.factcheck.org/").then(function (response) {

    let $ = cheerio.load(response.data);

    $("article").each(function (i, element) {
      const result = {};

      result.title = $(this)
        .children("h3")
        .children("a")
        .text();
      result.link = $(this)
        .children("h3")
        .children("a")
        .attr("href");
      result.summary = $(this)
        .children("div")
        .children("div")
        .children("div")
        .children("p")
        .text();

      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    res.send("Scrape Complete");
  });
});

app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
