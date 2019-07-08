let chai = require('chai');
let expect = chai.expect;
let auth = require('../auth');
let mock = require('./mock')

describe('Auth', () => {
  mock.unExistusers.forEach(user => {
    describe(user, () => {
      it(`user ${user} should NOT exist`, async () => {
        expect(await auth.userExist(user)).to.be.false
      });
    });
  })

  Object.keys(mock.users).forEach((user => {
    describe(user, () => {
      it(`user ${user} should exist`, async () => {
        expect(await auth.userExist(user)).to.be.true
      });
    });
  }))

  Object.keys(mock.users).forEach((user => {
    describe(user, () => {
      it(`should return ${user} as user alias`, async () => {
        const profile = await auth.createOrAuthUser(mock.users[user])
        expect(profile.put.alias).to.be.equal(user);
      });
    });
  }))

  Object.keys(mock.wrongPasswordUsers).forEach((user => {
    describe(user, () => {
      it(`should return "Wrong user or password." for ${user}`, async () => {
        try {
          await auth.createOrAuthUser(mock.wrongPasswordUsers[user])
        } catch (error) {
          expect(error).to.be.equal("Wrong user or password.")
        }
      });
    });
  }))
});

