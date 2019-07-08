let chai = require('chai');
let expect = chai.expect;
let auth = require('../auth');
const { users } = require('./mock')
var Gun = require('gun'); // in NodeJS 
require('gun/sea');
var SEA = Gun.SEA;

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
          expect(dec).to.be.equal(messageToEncrypt)
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
          expect(dec).to.be.equal(messageToEncrypt)
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
          expect(dec).to.be.equal(messageToEncrypt)
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