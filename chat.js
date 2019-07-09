const gun = require('./index')

module.exports = {
  createUserChat
}

async function createUserChat(chatRoomName = 'chat01') {
  return new Promise((resolve, reject) => {
    gun.user().get('rooms').get('name').put(chatRoomName, (ack) => {
      console.log('created')
      ack.err ? reject(ack, err) : resolve(ack.ok)
    })
  })
}