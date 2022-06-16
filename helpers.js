

  const filteredObject = (urlDB,key) => { urlDB = Object.keys(urlDB).reduce(function(acc, val) {
    if (urlDB[val].userID === key)  acc[val] = urlDB[val];
    return acc;
  }, {})
  return urlDB
  };


const getUserByEmail = (key, usersDB) => { 
  for (let val in usersDB) {
             if (usersDB[val].email === key) {
            return usersDB[val]; 
        }
      } 
    }
    
module.exports = {filteredObject, getUserByEmail}
// module.exports = filteredObject
// module.exports = getUserByEmail