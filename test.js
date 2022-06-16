const id = {
  b6UTxQ: { longURL: 'https://www.tsn.ca', userID: 'aJ48lW' },
  i3BoGr: { longURL: 'https://www.google.ca', userID: 'aJ48lW' },
  lijrmbf: { longURL: 'http://www.fff.com', userID: 'userjljpbnj' }
    
};
const templateVars = {};
const generateRandomString = function() {
  return Math.floor((1 + Math.random()) * 0x1000000000).toString(30).substring(1);
  
};
const filteredObject = (ids) => { ids = Object.keys(ids).reduce(function(acc, val) {
  if (ids[val].userID === 'aJ48lW')  acc[val] = ids[val];
  return acc;
}, {})
return ids
};

// console.log(urlsForUser(urlDatabase));
console.log(filteredObject(id));