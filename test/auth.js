let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
let auth = require('../auth');

const users = {
  boston: { username: 'boston', password: 'boston' },
  chicago: { username: 'chicago', password: 'chicago' },
  florida: { username: 'florida', password: 'florida' },
}

const unExistusers = ['bimbo', 'jaum']

const wrongPasswordUsers = {
  boston: { username: 'boston', password: 'wrong' },
  chicago: { username: 'chicago', password: 'wrong' },
  florida: { username: 'florida', password: 'wrong' },
}

describe('Auth', () => {
  unExistusers.forEach(user => {
    describe(user, () => {
      it(`user ${user} should NOT exist`, async () => {
        expect(await auth.userExist(user)).to.be.false
      });
    });
  })

  Object.keys(users).forEach((user => {
    describe(user, () => {
      it(`user ${user} should exist`, async () => {
        expect(await auth.userExist(user)).to.be.true
      });
    });
  }))

  Object.keys(users).forEach((user => {
    describe(user, () => {
      it(`should return ${user} as user alias`, async () => {
        const profile = await auth.createOrAuthUser(users[user])
        profile.put.alias.should.be.equal(user);
      });
    });
  }))

  Object.keys(wrongPasswordUsers).forEach((user => {
    describe(user, () => {
      it(`should return "Wrong user or password." for ${user}`, async () => {
        try {
          await auth.createOrAuthUser(wrongPasswordUsers[user])
        } catch (error) {
          error.should.be.equal("Wrong user or password.")
        }
      });
    });
  }))
});

