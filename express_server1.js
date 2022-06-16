const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const morgan = require("morgan");
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
// const cookie = require('cookie')
const cookieParser = require('cookie-parser');

const urlDatabase = {
  b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userID: "aJ48lW"
    },
    i3BoGr: {
        longURL: "https://www.google.ca",
        userID: "aJ48lW"
    }
};
const templateVars = {};
const generateRandomString = function() {
  return Math.floor((1 + Math.random()) * 0x1000000000).toString(30).substring(1);
  
};
const urlsForUser = (id) => {
      
}
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 
}
// MIDDLE
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//ROUTE 
app.get("/register", (req, res) => {
  if(!req.cookies.user_id){
  const templateVars = { urls: urlDatabase, user_id : req.cookies.user_id };
  res.render("register", templateVars);
}
  else{res.redirect(`/urls/`)}
});

app.post("/register", function(req, res) {
if ( !req.body.email || !req.body.password ){
  res.status(400).redirect('/login')
}
else
{
for (let key in users){
if ( users[key].user_id === req.body.email){
 return res.status(400).redirect('/login')
}}
{
  userID = "user"+generateRandomString();
  users[userID] = {}
  users[userID].id = userID;
  users[userID].user_id = req.body.email;
  users[userID].password = req.body.password;
    // templateVars.user_id = req.body.user_id;
  // req.cookies.user_id = req.body.user_id
  console.log(users ,req.cookies);
  res.cookie('user_id', users[userID]).redirect(301, '/urls/');
}
}

});

// app.get("/urls/login", (req, res) => {
//   const templateVars = { urls: urlDatabase, user_id : req.cookies.user_id };
//   res.redirect(`/urls/`)
//  });
app.post("/logout", function(req, res) {
    res.clearCookie('user_id').redirect(301, '/urls/');
  // res.redirect(`/urls/`);
});
app.get("/login", (req, res) => {
  if(!req.cookies.user_id){
  const templateVars = { urls: urlDatabase, user_id : req.cookies.user_id };
  res.render("login", templateVars);
  }
  else{res.redirect(`/urls/`)}

});
app.post("/login", function(req, res) {
  console.log(req.body, users)
  for (let key in users){
    if ( users[key].user_id === req.body.email && users[key].password === req.body.password){
      return res.cookie('user_id', users[key]).redirect(301, '/urls/')
          }
    else { console.log('password  or email fail')
    // //   // alert('password  or email fail!')

    //  return res.status(403).redirect('/login')
    }}
          
});



app.get("/urls/new", (req, res) => {
  if(!req.cookies.user_id){
    res.redirect(`/`)
}

    else{
  const templateVars = { urls: urlDatabase, user_id : req.cookies.user_id };
  res.render("urls_new", templateVars);
}
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
  const templateVars = { 'shortURL': shortURL, 'longURL': urlDatabase[shortURL].longURL,  urls: urlDatabase, user_id : req.cookies.user_id };
  res.render("urls_show", templateVars);
});
app.post("/urls/:id", (req, res) => {
  if(!req.cookies.user_id){
    res.redirect(`/`)
}

    else{
  const shortURL = req.params.id;
  urlDatabase[shortURL].longURL = req.body.longURL;
  res.redirect(`/urls/`);
    }
});
/// START LOOKING PROBLEM HERE
  
  
app.get("/u/:shortURL", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id : req.cookies.user_id  };
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});
app.get("/urls", (req, res) => {
  if(!req.cookies.user_id){
    res.redirect(`/`)
}

    else{
      //fn find database for user
  
  const templateVars = { urls: urlDatabase, user_id : req.cookies.user_id };
  res.render("urls_index", templateVars);
    }
});
app.post("/urls", (req, res) => {
  if(!req.cookies.user_id){
    res.redirect(`/`)
}

    else{
  let id = generateRandomString();
  urlDatabase[id] = {}
  urlDatabase[id].longURL = req.body.longURL;
  urlDatabase[id].user_id = req.cookies.user_id;
  // Log the POST request body to the console
  // res.send("Good news everyone! Your form submitted");
  res.redirect(`/urls/${id}`);        // Respond with 'Ok' (we will replace this)
    }
});
app.get("/", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id : req.body.user_id };
  res.render("main", templateVars);
  
});
  
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
  
// always npm start for nodemon