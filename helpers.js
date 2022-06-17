// Helpers for Tinyapp

const filteredObject = (urlDB,key) => {
  urlDB = Object.keys(urlDB).reduce(function(acc, val) {
    if (urlDB[val].userID === key)  acc[val] = urlDB[val];
    return acc;
  }, {});
  return urlDB;
};


const generateRandomString = function() {
  return Math.floor((1 + Math.random()) * 0x1000000000).toString(30).substring(1);
};

const getUserByEmail = (key, usersDB) => {
  for (let val in usersDB) {
    if (usersDB[val].email === key) {
      return usersDB[val];
    }
  }
};
const urlDatabase = {};
const users = {};
    
module.exports = {generateRandomString, filteredObject, getUserByEmail, urlDatabase, users};
