let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
let auth = require('../auth');

var Gun = require('gun'); // in NodeJS 
require('gun/sea');
var SEA = Gun.SEA;

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

describe('Sea', () => {
  describe('Encrypt and Decrypt', () => {
    describe('Encrypt, Sign and Decrypt his own message', () => {
      Object.keys(users).forEach((user => {
        it(`User ${user} should be able to encrypt and decrypt his message`, async () => {
          const boston = await auth.createOrAuthUser(users[user])
          const bostonPair = boston.sea
          const messageToEncrypt = `Good Morning ${user}!`
          var enc = await SEA.encrypt(messageToEncrypt, bostonPair);
          var data = await SEA.sign(enc, bostonPair);

          //check if comming from user
          var msg = await SEA.verify(data, bostonPair.pub);
          var dec = await SEA.decrypt(msg, bostonPair);
          dec.should.equal(messageToEncrypt)
        });
      }))
    })

    describe('Encrypt and Decrypt  another user message', () => {
      Object.keys(users).forEach(((user, index, array) => {
        const next = index === array.length - 1 ? array[0] : array[index + 1]
        it(`User ${user} should be able to decrypt ${next} message`, async () => {
          const boston = await auth.createOrAuthUser(users[next])
          const chicago = await auth.createOrAuthUser(users[user])
          const bostonPair = boston.sea
          const chicagoPair = chicago.sea
          const messageToEncrypt = `Good Morning ${next}!`
          var enc = await SEA.encrypt(messageToEncrypt, await SEA.secret(chicagoPair.epub, bostonPair));
          var dec = await SEA.decrypt(enc, await SEA.secret(bostonPair.epub, chicagoPair));
          dec.should.equal(messageToEncrypt)
        });
      }))
    })


    describe('Encrypt, Sign and Decrypt another user message', () => {
      Object.keys(users).forEach(((user, index, array) => {
        const next = index === array.length - 1 ? array[0] : array[index + 1]
        it(`User ${user} should be able to decrypt ${next} message`, async () => {
          const boston = await auth.createOrAuthUser(users[next])
          const chicago = await auth.createOrAuthUser(users[user])
          const bostonPair = boston.sea
          const chicagoPair = chicago.sea
          const messageToEncrypt = `Good Morning ${next}!`
          var enc = await SEA.encrypt(messageToEncrypt, await SEA.secret(chicagoPair.epub, bostonPair));
          
          var data = await SEA.sign(enc, bostonPair);
         
          //check if comming from boston
          var msg = await SEA.verify(data, bostonPair.pub);

          var dec = await SEA.decrypt(msg, await SEA.secret(bostonPair.epub, chicagoPair));
          dec.should.equal(messageToEncrypt)
        });
      }))
    })

    describe('Encrypt, Sign and NOT decrypt another user message', () => {
      Object.keys(users).forEach(((user, index, array) => {
        const next = index === array.length - 1 ? array[0] : array[index + 1]
        it(`User ${user} should be NOT able to decrypt ${next} message`, async () => {
          const boston = await auth.createOrAuthUser(users[next])
          const chicago = await auth.createOrAuthUser(users[user])
          const bostonPair = boston.sea
          const chicagoPair = chicago.sea
          const messageToEncrypt = `Good Morning ${next}!`


          var enc = await SEA.encrypt(messageToEncrypt, bostonPair);
          var data = await SEA.sign(enc, bostonPair);
                   
          //check if comming from boston
          var msg = await SEA.verify(data, bostonPair.pub);

          var dec = await SEA.decrypt(msg, await SEA.secret(bostonPair.epub, chicagoPair));
          expect(dec).to.be.undefined
        });
      }))
    })
  });
});