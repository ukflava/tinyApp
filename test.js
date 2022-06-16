const id = {
  b6UTxQ: { longURL: 'https://www.tsn.ca', userID: 'aJ48lW' },
  i3BoGr: { longURL: 'https://www.google.ca', userID: 'aJ48lW' },
  lijrmbf: { longURL: 'http://www.fff.com', userID: 'userjljpbnj' }
    
};
const templateVars = {};
const generateRandomString = function() {
  return Math.floor((1 + Math.random()) * 0x1000000000).toString(30).substring(1);
}
  const users = {
    usertqfdr9k: {
      id: 'usertqfdr9k',
      user_id: 'a@a.com',
      password: '$2a$10$Gq1Gym6gaF6zBb70N/S8.uv7N/IoVwytxcVvc.Vj/nWMMyaF85ag6'
    }
  }
// const filteredObject = (ids) => { ids = Object.keys(ids).reduce(function(acc, val) {
//   if (ids[val].userID === 'aJ48lW')  acc[val] = ids[val];
//   return acc;
// }, {})
// return ids
// };

// console.log(urlsForUser(urlDatabase));

const {filteredObject, getUserByEmail} = require("./helpers")
// const getUserByEmail = (key, usersDB) => { usersDB = Object.keys(usersDB).reduce(function(acc, val) {
//   if (usersDB[val].user_id === key)  acc[val] = usersDB[val];
//   return acc;
// }, {})
// return usersDB
// };
// const getUserByEmail = filteredObject;
// console.log(filteredObject(id,key));

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
  userhbl7a8r: {
    id: 'userhbl7a8r',
    email: 'q@q.com',
    password: '$2a$10$6C5cfhehEMpk4bRfXfMJKOgckgl2lWT7BOz9b8k2rLJ5M42DxhtS.'
  },
  user59mpgbh: {
    id: 'user59mpgbh',
    email: 'q@a.com',
    password: '$2a$10$hGKOkHdgGuy590vJDM7YDe0Bi9pKetQL6Orkr1BxkYoxWKE.d6O7y'
  }

};
let user = getUserByEmail("q@a.com", testUsers);
// console.log(Object.values(user))
console.log(user.id)