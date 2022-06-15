const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const morgan = require("morgan")
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
// const cookie = require('cookie')
const cookieParser = require('cookie-parser')

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const templateVars = {}
const generateRandomString = function() {
  return Math.floor((1 + Math.random()) * 0x1000000000).toString(30).substring(1);
  
};

app.use(morgan("dev"))
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

// app.get("/urls/login", (req, res) => {
//   const templateVars = { urls: urlDatabase, username : req.cookies.username };
//   res.redirect(`/urls/`)
//  });
app.post("/logout", function (req, res) {
    console.log(req.cookies)
  res.clearCookie('username').redirect(301, '/urls/');
});
app.post("/login", function (req, res) {
  
  let username = req.body.username
  templateVars.username = req.body.username
  // req.cookies.username = req.body.username
  console.log(req.cookies)
  res.cookie('username', username).redirect(301, '/urls/');
});



app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, username : req.cookies.username };
  res.render("urls_new", templateVars);
});
// app.get("/hello", (req, res) => {
  //   res.send("<html><body>Hello <b>World</b></body></html>\n");
  // });
  app.post("/urls/:shortURL/delete", (req, res) => {
    const shortURL = req.params.shortURL
    // console.log("aaaaaaa")
    delete urlDatabase[shortURL]
    // console.log(urlDatabase)
    res.redirect(`/urls/`);        // Respond with 'Ok' (we will replace this)
  });
  app.get("/urls/:shortURL", (req, res) => { 
    const shortURL = req.params.shortURL
    const templateVars = { 'shortURL': shortURL, 'longURL': urlDatabase[shortURL],  urls: urlDatabase, username : req.cookies.username };
       res.render("urls_show", templateVars);
  });
  app.post("/urls/:id", (req, res) => {
    const shortURL = req.params.id
    urlDatabase[shortURL] = req.body.longURL
    res.redirect(`/urls/`);     
  });
  /// START LOOKING PROBLEM HERE
  
  
  app.get("/u/:shortURL", (req, res) => {
    const templateVars = { urls: urlDatabase, username : req.cookies.username  };
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL];
    res.redirect(longURL);
  });
  app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase, username : req.cookies.username };
    res.render("urls_index", templateVars);
  });
  app.post("/urls", (req, res) => {
    let id = generateRandomString()
    urlDatabase[id] = req.body.longURL;
    // Log the POST request body to the console
    // res.send("Good news everyone! Your form submitted"); 
    res.redirect(`/urls/${id}`);        // Respond with 'Ok' (we will replace this)
  });
  app.get("/", (req, res) => {
    const templateVars = { urls: urlDatabase, username : req.body.username };
    res.render("urls_index", templateVars)
   });
  
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });
  
  // always npm start for nodemon