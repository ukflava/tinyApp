const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const morgan = require("morgan");
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
// const cookie = require('cookie')
// const popup = require('popups')
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs')
// REfactored to user_id as requested, but its confusing - we have userid in different cases 3 times


//GLOBAL SCOPE VARS AND FN
const urlDatabase = {
  sgq3y6: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
};
const templateVars = {};
const generateRandomString = function() {
  return Math.floor((1 + Math.random()) * 0x1000000000).toString(30).substring(1);
};
const users = {};

const filteredObject = (urlDB,key) => { urlDB = Object.keys(urlDB).reduce(function(acc, val) {
  if (urlDB[val].userID === key)  acc[val] = urlDB[val];
  return acc;
}, {})
return urlDB
};



// MIDDLEWARE********************************************
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());



//ROUTE
// ACCOUNTING USERS************************************************
app.get("/register", (req, res) => {
  if (!req.cookies.user_id) {
    const templateVars = { urls: urlDatabase, user_id : req.cookies.user_id };
    res.render("register", templateVars);
  }  else {
    res.redirect(`/urls/`);
  }
});

app.post("/register", function(req, res) {
  if (!req.body.email || !req.body.password) {
    res.status(400).redirect('/login');
  } else {
    for (let key in users) {
      if (users[key].user_id === req.body.email) {
        return res.status(400).redirect('/login');
      }
    }
    {
      let userID = "user" + generateRandomString();
      users[userID] = {};
      users[userID].id = userID;
      users[userID].user_id = req.body.email;
      users[userID].password = bcrypt.hashSync(req.body.password,10);
      console.log(users ,req.cookies);
      res.cookie('user_id', users[userID]).redirect(301, '/urls/');
    }
  }
});
app.post("/logout", function(req, res) {
  res.clearCookie('user_id').redirect(301, '/urls/');
  // res.redirect(`/urls/`);
});
app.get("/login", (req, res) => {
  if (!req.cookies.user_id) {
    const templateVars = { urls: urlDatabase, user_id : req.cookies.user_id };
    res.render("login", templateVars);
  } else {
    res.redirect(`/urls/`);
  }
});
app.post("/login", function(req, res) {
  console.log(req.body, users);
  if (req.body.email && req.body.email) {
    for (let key in users) {
      if (users[key].user_id === req.body.email && bcrypt.compareSync(req.body.password, users[key].password)) {
        return res.cookie('user_id', users[key]).redirect(301, '/urls/');
      }res.send("Invalid login");
      //   // alert('password  or email fail!')
    }
  } else res.send("Invalid login");
});


// PRODUCTION CODE************************************************
app.get("/urls/new", (req, res) => {
  if (!req.cookies.user_id) {
    res.redirect(`/`);
  } else {
    const templateVars = { urls: urlDatabase, user_id : req.cookies.user_id };
    res.render("urls_new", templateVars);
  }
});
app.get("/urls/:shortURL", (req, res) => {
  // console.log("DB-from-new",urlDatabase)
  const shortURL = req.params.shortURL;
  const templateVars = { 'shortURL': shortURL, 'longURL': urlDatabase[shortURL].longURL,  urls: urlDatabase, user_id : req.cookies.user_id };
  res.render("urls_show", templateVars);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID === req.cookies.user_id.id) {
    delete urlDatabase[shortURL];
    // console.log(urlDatabase)
    res.redirect(`/urls/`);
  } else {
    res.send("You dont have permission for this operation");
  }
});
app.post("/urls/:id", (req, res) => {
  if (!req.cookies.user_id) {
    res.redirect(`/`);
  }  else if (req.body.longURL.length <= 2) {
  
    res.send("Empty URL");
  } else {
    const shortURL = req.params.id;
    if (urlDatabase[shortURL].userID === req.cookies.user_id.id) {
      const shortURL = req.params.id;

      urlDatabase[shortURL].longURL = req.body.longURL;
      res.redirect(`/urls/`);
    }
  }
});

  
// MAIN PAGE URLS CODE**************************************************
app.get("/urls", (req, res) => {
  if (!req.cookies.user_id) {
    res.redirect(`/`);
  } else {
    const filteredURL = filteredObject(urlDatabase, req.cookies.user_id.id)  
    console.log(filteredURL, urlDatabase);
    const templateVars = { urls: filteredURL, user_id : req.cookies.user_id };
    res.render("urls_index", templateVars);
  }
});
app.post("/urls", (req, res) => {
  if (!req.cookies.user_id) {
    res.redirect(`/`);
  } else if (req.body.longURL.length <= 2) {
    res.redirect(`/urls/new`);
  } else {
    let id = generateRandomString();
    console.log("cookies user_id from urls",req.cookies.user_id);
    urlDatabase[id] = {};
    urlDatabase[id].longURL = req.body.longURL;
    urlDatabase[id].userID = req.cookies.user_id.id;
     res.redirect(`/urls/${id}`);        
  }
});

// MAIN PAGE *******************************************
app.get("/", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id : req.body.user_id };
  res.render("main", templateVars);
});
// REDIRECT FUNCTION**********************************************
app.get("/u/:shortURL", (req, res) => {
  // const templateVars = { urls: urlDatabase, user_id : req.cookies.user_id  };
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});
// SERVER LISTENING***************************************
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

