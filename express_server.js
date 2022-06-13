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
const generateRandomString = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
}
app.use(morgan("dev"))
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
 });
 app.get("/urls/:shortURL", (req, res) => { 
  const shortURL = req.params.shortURL
  // console.log(shortURL)
  // return res.send("helo")
  const templateVars = { 'shortURL': shortURL, 'longURL': urlDatabase[shortURL] };
  // console.log(templateVars);
  res.render("urls_show", templateVars);
});
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Good news everyone! Your form submitted");         // Respond with 'Ok' (we will replace this)
});
 
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});