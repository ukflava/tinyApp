const { expect, assert } = require('chai');
// const chai = require('chai');
// const expect = chai.expect;
const help = require('../helpers.js');

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
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = help.getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    expect(user.id).to.equal(expectedUserID)
  });
  it('should return undefined with invalid email', function() {
    const user = help.getUserByEmail("uddddddd@d.com", testUsers)
        expect(user).to.equal(undefined)
  });
  it('should return object with valid email', function() {
    const user = help.getUserByEmail("user@example.com", testUsers)
      assert.isObject(user)
  });
});