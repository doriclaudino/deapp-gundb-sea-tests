var Gun = require('gun');
var gun = Gun();
require('gun/lib/then')

module.exports = {
  createOrAuthUser: createOrAuthUser,
  userExist: userExist,
}

async function createOrAuthUser({ username, password }) {
  const exist = await userExist(username)
  if (!exist)
    await createUser({ username, password })
  return authUser({ username, password })
}


function authUser({ username, password }) {
  return new Promise((resolve, reject) => {
    gun.user().auth(username, password, function (ack) {
      ack.err ? reject(ack.err) : resolve(ack)
    })
  })
}

function createUser({ username, password }) {
  return new Promise((resolve, reject) => {
    gun.user().create(username, password, function (ack) {
      ack.err ? reject(ack.err) : resolve(ack)
    })
  })
}

function userExist(alias) {
  return new Promise((resolve, reject) => {
    gun.get(`~@${alias}`, function (ack) {
      if (ack.err)
        reject(ack.err)
      else
        ack.put ? resolve(true) : resolve(false)
    })
  })
}