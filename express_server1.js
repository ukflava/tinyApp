const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const morgan = require("morgan");
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
// const cookie = require('cookie')
// const popup = require('popups')
// const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs')
const cookieSession = require('cookie-session')

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
const {filteredObject, getUserByEmail} = require("./helpers")



// MIDDLEWARE********************************************
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))



//ROUTE
// ACCOUNTING USERS************************************************
app.get("/register", (req, res) => {
  if (!req.session.user_id) {
    const templateVars = { urls: urlDatabase, user_id : req.session.user_id };
    res.render("register", templateVars);
  }  else {
    res.redirect(`/urls/`);
  }
});

app.post("/register", function(req, res) {
  if (!req.body.email || !req.body.password) {
    res.status(400).redirect('/login');
  } else { 
  // I can use Fn getUserByEmail because Compass say so - but it will not dry code
  // for (let key in users) {if (users[key].user_id === req.body.email) 
    const user = getUserByEmail(req.body.email, users)
    console.log("user from register", user)
    if(user){
        return res.send("This email already used, try another")
        // res.status(400).redirect('/login');
      }
    
    {
      let userID = "user" + generateRandomString();
      users[userID] = {};
      users[userID].id = userID;
      users[userID].email = req.body.email;
      users[userID].password = bcrypt.hashSync(req.body.password,10);
      console.log(users ,req.cookies);
      req.session.user_id = users[userID];
      res.redirect(301, '/urls/');
    }
  }
});
app.post("/logout", function(req, res) {
  req.session = null
  // res.clearCookie('user_id').redirect(301, '/urls/');
  res.redirect(301,`/urls/`);
});
app.get("/login", (req, res) => {
  if (!req.session.user_id) {
    const templateVars = { urls: urlDatabase, user_id : req.session.user_id };
    res.render("login", templateVars);
  } else {
    res.redirect(`/urls/`);
  }
});
app.post("/login", function(req, res) {
  console.log(req.body, users);
  if (req.body.email && req.body.email) {
    // can use Fn find user here - but prefer to use loop key to check password same user
    for (let key in users) {
      if (users[key].email === req.body.email && bcrypt.compareSync(req.body.password, users[key].password)) {
        req.session.user_id = users[key] 
        return res.redirect(301, '/urls/');
      }res.send("Invalid login");
      //   // alert('password  or email fail!')
    }
  } 
});


// PRODUCTION CODE************************************************
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect(`/`);
  } else {
    const templateVars = { urls: urlDatabase, user_id : req.session.user_id };
    res.render("urls_new", templateVars);
  }
});
app.get("/urls/:shortURL", (req, res) => {
  // console.log("DB-from-new",urlDatabase)
  const shortURL = req.params.shortURL;
  const templateVars = { 'shortURL': shortURL, 'longURL': urlDatabase[shortURL].longURL,  urls: urlDatabase, user_id : req.session.user_id };
  res.render("urls_show", templateVars);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID === req.session.user_id.id) {
    delete urlDatabase[shortURL];
    // console.log(urlDatabase)
    res.redirect(`/urls/`);
  } else {
    res.send("You dont have permission for this operation");
  }
});
app.post("/urls/:id", (req, res) => {
  if (!req.session.user_id) {
    res.redirect(`/`);
  }  else if (req.body.longURL.length <= 2) {
  
    res.send("Empty URL");
  } else {
    const shortURL = req.params.id;
    if (urlDatabase[shortURL].userID === req.session.user_id.id) {
      const shortURL = req.params.id;

      urlDatabase[shortURL].longURL = req.body.longURL;
      res.redirect(`/urls/`);
    }
  }
});

  
// MAIN PAGE URLS CODE**************************************************
app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.redirect(`/`);
  } else {
    const filteredURL = filteredObject(urlDatabase, req.session.user_id.id)  
    console.log(filteredURL, urlDatabase);
    const templateVars = { urls: filteredURL, user_id : req.session.user_id };
    res.render("urls_index", templateVars);
  }
});
app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.redirect(`/`);
  } else if (req.body.longURL.length <= 2) {
    res.redirect(`/urls/new`);
  } else {
    let id = generateRandomString();
    console.log("session user_id from urls",req.session.user_id);
    urlDatabase[id] = {};
    urlDatabase[id].longURL = req.body.longURL;
    urlDatabase[id].userID = req.session.user_id.id;
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
  // const templateVars = { urls: urlDatabase, user_id : req.session.user_id  };
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});
// SERVER LISTENING***************************************
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

