const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const morgan = require("morgan");
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
// const cookie = require('cookie')
const cookieParser = require('cookie-parser');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const templateVars = {};
const generateRandomString = function() {
  return Math.floor((1 + Math.random()) * 0x1000000000).toString(30).substring(1);
  
};
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 
}

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, username : req.cookies.username };
  res.render("register", templateVars);
});
app.post("/register", function(req, res) {
if ( !req.body.email || !req.body.password ){
  res.status(400).redirect('/login')
}
for (let key in users){
if ( users[key].username === req.body.email){
  res.status(400).redirect('/login')
}};
{
  userID = "user"+generateRandomString();
  users[userID] = {}
  users[userID].id = userID;
  users[userID].username = req.body.email;
  users[userID].password = req.body.password;
    // templateVars.username = req.body.username;
  // req.cookies.username = req.body.username
  console.log(users ,req.cookies);
  res.cookie('username', users[userID]).redirect(301, '/urls/');
}
});

// app.get("/urls/login", (req, res) => {
//   const templateVars = { urls: urlDatabase, username : req.cookies.username };
//   res.redirect(`/urls/`)
//  });
app.post("/logout", function(req, res) {
    res.clearCookie('username').redirect(301, '/urls/');
  // res.redirect(`/urls/`);
});
app.get("/login", (req, res) => {
  const templateVars = { urls: urlDatabase, username : req.cookies.username };
  res.render("login", templateVars);
});
app.post("/login", function(req, res) {
  for (let key in users){
    if ( users[key].username === req.body.email && users[key].password === req.body.password){
      res.cookie('username', users[key]).redirect(301, '/urls/')
      
    }
  else { console.log('password  or email fail')
    // alert('password  or email fail!')
    res.status(403).redirect('/login')}}
 
});



app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, username : req.cookies.username };
  res.render("urls_new", templateVars);
});
// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  // console.log("aaaaaaa")
  delete urlDatabase[shortURL];
  // console.log(urlDatabase)
  res.redirect(`/urls/`);        // Respond with 'Ok' (we will replace this)
});
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = { 'shortURL': shortURL, 'longURL': urlDatabase[shortURL],  urls: urlDatabase, username : req.cookies.username };
  res.render("urls_show", templateVars);
});
app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.longURL;
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
  let id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  // Log the POST request body to the console
  // res.send("Good news everyone! Your form submitted");
  res.redirect(`/urls/${id}`);        // Respond with 'Ok' (we will replace this)
});
app.get("/", (req, res) => {
  const templateVars = { urls: urlDatabase, username : req.body.username };
  res.render("urls_index", templateVars);
});
  
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
  
// always npm start for nodemon