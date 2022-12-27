//jshint esversion:6

// GLOBAL VARIABLES


const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose"); //require mongoose to be able to interact with the database

const homeStartingContent = "Welcome to our day journaling website! Do you often find yourself missing deadlines and forgetting things? Our website is here to help you keep track of your daily activities and stay organized. Simply visit the '/compose' directory to write a journal entry about your day. With our website, you can easily remember important parts of your day and stay on top of your responsibilities. Whether you're a busy student, a professional with a hectic schedule, or anyone who wants to stay organized, our day journaling website is perfect for you. Give it a try and see how it can help you stay on track!";
const aboutContent = "My name is Emmanuel, and I am a third-year computer science student at Wilfrid Laurier University. This website was developed as a project to showcase my skills in web development. It was built using HTML for the layout, CSS for styling, and JavaScript for functionality. EJS was used for page templating, and the backend was built using the Node.js framework Express.js. The database is powered by MongoDB, and I used Mongoose to interact with it. If you're someone who values organization and wants a simple and effective way to keep track of your daily activities, this website is for you. Give it a try and see how it can help you stay on top of your responsibilities and never forget an important deadline again!";
const contactContent = "To contact me, please email me at emmanuelakinlosotu12@gmail.com. I am always happy to hear from users and welcome feedback or suggestions. I will do my best to respond promptly. Thank you for using our website.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//create database named blodDB
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

//JSON format
const blogSchema = {
  title: String,
  body: String
};

//create a collection in the database using blog schema named Blogs's
const Blog = mongoose.model("Blog", blogSchema);




//home route function handler
app.get("/", function(req, res){
  posts = [];
  Blog.find({}, function(err, foundItems){
    res.render("home", {homeStartingContent: homeStartingContent, posts: foundItems});
  });

  
});



app.get("/posts/:blogPostTitle", function(req, res){
  let blogPostObj = {}
  Blog.find({}, function(err, foundItems){
    for (let i = 0; i < foundItems.length; i++){
      console.log(lodash.lowerCase(foundItems[i].title));
      console.log(lodash.lowerCase(req.params.blogPostTitle));
      if (lodash.lowerCase(foundItems[i].title) === lodash.lowerCase(req.params.blogPostTitle)){
        blogPostObj = foundItems[i];
      } else {
        console.log("No match found");
      }
    }
    res.render("post", {title: blogPostObj.title, body: blogPostObj.body})
  });
  
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose", {});
});

app.post("/compose", function(req, res){
  const title = req.body.title;
  const body = req.body.postBody;
  
  const post = new Blog({
    title: title,
    body: body
  });

  post.save();
  posts.push(post);
  res.redirect("/");
});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
