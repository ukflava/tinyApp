// NOTES
// Identifier 'user_id' is not in camel case - requested by Compass


const express = require("express");
const app = express();
const PORT = 8080;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');
app.set("view engine", "ejs");

//GLOBAL SCOPE VARS AND FN

const {generateRandomString, filteredObject, getUserByEmail, urlDatabase, users} = require("./helpers");



// MIDDLEWARE********************************************
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

//ROUTE
// ACCOUNTING USERS************************************************
// GET /register
app.get("/register", (req, res) => {
  if (!req.session.user_id) {
    const templateVars = { urls: urlDatabase, user_id : req.session.user_id };
    res.render("register", templateVars);
  }  else {
    res.redirect(`/urls/`);
  }
});

// POST REGISTER
app.post("/register", function(req, res) {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Error: Check your email and password');
  } else {
    const user = getUserByEmail(req.body.email, users);
    if (user) {
      return res.status(403).send("This email already used, try another");
    } else {
      let userID = "user" + generateRandomString();
      users[userID] = {};
      users[userID].id = userID;
      users[userID].email = req.body.email;
      users[userID].password = bcrypt.hashSync(req.body.password,10);
      req.session.user_id = users[userID];
      res.status(301).redirect('/urls/');
    }
  }
});
// LOGIN USERS***************************************
// GET /login
app.get("/login", (req, res) => {
  if (!req.session.user_id) {
    const templateVars = { urls: urlDatabase, user_id : req.session.user_id };
    res.render("login", templateVars);
  } else {
    res.redirect(`/urls/`);
  }
});

// POST LOGIN
app.post("/login", function(req, res) {
  if (req.body.email && req.body.email) {
    // can use Fn find user here - but prefer to use loop key to check password of same user - code still dry
    for (let key in users) {
      if (users[key].email === req.body.email && bcrypt.compareSync(req.body.password, users[key].password)) {
        req.session.user_id = users[key];
        return res.status(301).redirect('/urls/');
      }
      
    }res.status(401).send("Invalid login");
  }
});
// POST /logout
app.post("/logout", function(req, res) {
  req.session = null;
  res.status(302).redirect(`/urls`);
});


// NEW AND CREATED URLS RENDER SECTION ****************************
// GET /urls/new
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect(`/login`);
  } else {
    const templateVars = { urls: urlDatabase, user_id : req.session.user_id };
    res.render("urls_new", templateVars);
  }
});

// GET /urls/:id
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!req.session.user_id) {
    res.status(401).send("Login to visit this page");
  }
  if (!urlDatabase[shortURL]) {
    res.status(404).send("Requested URL not found");
  }
  if (urlDatabase[shortURL].userID === req.session.user_id.id) {
          
    urlDatabase[shortURL].statistics.push(`VISITED: ${generateRandomString()} /  DATE: ${new Date(Date.now())}`);
    urlDatabase[shortURL].visited = (urlDatabase[shortURL].visited || 0) + 1;
    const templateVars = { statistics : urlDatabase[shortURL].statistics, 'shortURL': shortURL, 'longURL': urlDatabase[shortURL].longURL, views: urlDatabase[shortURL].visited,  urls: urlDatabase, user_id : req.session.user_id };
    res.render("urls_show", templateVars);
  } else {
    res.status(401).send("You dont have permission for this action");
  }
});

// EDIT AND DELETE URLS POST SECTION
// POST CHANGED TO DELETE /urls/:id/delete
app.delete("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!req.session.user_id) {
    res.status(401).send("You need to login for this action");
  } if (urlDatabase[shortURL].userID !== req.session.user_id.id) {
    res.status(401).send("You dont have permission for this action");
  } else {
    if (urlDatabase[shortURL].userID === req.session.user_id.id) {
      delete urlDatabase[shortURL];
      res.redirect(`/urls/`);
    }
  }
});
// POST CHANGED TO PUT /urls/:id
app.put("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  if (!req.session.user_id) {
    res.status(401).send("You need to login for this action");
  } if (urlDatabase[shortURL].userID !== req.session.user_id.id) {
    res.status(401).send("You dont have permission for this action");
  } else {
    if (urlDatabase[shortURL].userID === req.session.user_id.id) {
      if (req.body.longURL.length <= 2) {
        res.status(406).send("Empty URL");
      } else {
        urlDatabase[shortURL].longURL = req.body.longURL;
        res.redirect(`/urls/`);
      }
    }
  }
});

  
// MAIN PAGE URLS CODE**************************************************
// GET /urls
app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.status(401).send("You need to login first ");
  } else {
    const filteredURL = filteredObject(urlDatabase, req.session.user_id.id);
    const templateVars = { urls: filteredURL, user_id : req.session.user_id };
    res.render("urls_index", templateVars);
  }
});
//POST /urls
app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.redirect(`/login`);
  } else if (req.body.longURL.length <= 2) {
    res.redirect(`/urls/new`);
  } else {
    let id = generateRandomString();
    urlDatabase[id] = {};
    urlDatabase[id].longURL = req.body.longURL;
    urlDatabase[id].userID = req.session.user_id.id;
    urlDatabase[id].statistics = [];
    res.redirect(`/urls/${id}`);
  }
});

// MAIN PAGE AND LOGIN/REGISTRATION OPTIONS (NOT REQUESTED IN COMPASS)*******************************************
// WAS LOGIN PAGE BEFORE REFACTORING WITH REDIRECTION FOR CHECKMARKS
app.get("/main", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id : req.body.user_id };
  res.render("main", templateVars);
});

// GET /
app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.status(302).redirect(`/urls`);
  } else {
    res.status(302).redirect(`/login`);
  }
  
});
// REDIRECT FUNCTION**********************************************
//GET /u/:id
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    res.status(404).send("Requested URL not found");
  } else {
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL].longURL;
    res.redirect(longURL);
  }
});
// SERVER ***************************************
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

