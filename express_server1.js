const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const morgan = require("morgan")
app.set("view engine", "ejs");
const bodyParser = require("body-parser");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const generateRandomString = function() {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(30).substring(1);
  
};

app.use(morgan("dev"))
app.use(bodyParser.urlencoded({extended: true}));
// app.get("/urls/:id", (req, res) => {
//   const id = req.params.id;
//   console.log('id:',id)
//   res.render("urls_show", id);
//  });
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
    const templateVars = { 'shortURL': shortURL, 'longURL': urlDatabase[shortURL] };
    res.render("urls_show", templateVars);
  });
  app.post("/urls/:id", (req, res) => {
    const shortURL = req.params.id
    console.log("short:", shortURL)
    urlDatabase[shortURL] = req.body.longURL
    console.log(req.body, req.params)
    res.redirect(`/urls/`);     
  });
/// START LOOKING PROBLEM HERE


app.get("/u/:shortURL", (req, res) => {

  const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL];
  console.log("long", shortURL, longURL, urlDatabase)
  res.redirect(longURL);
});
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
 });
app.post("/urls", (req, res) => {
  let id = generateRandomString()
  console.log(id)
  urlDatabase[id] = req.body.longURL;
  console.log(urlDatabase)  // Log the POST request body to the console
  // res.send("Good news everyone! Your form submitted"); 
  res.redirect(`/urls/${id}`);        // Respond with 'Ok' (we will replace this)
});
 
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// always npm start for nodemon