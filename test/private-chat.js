let chai = require('chai');
let expect = chai.expect;
const { createOrAuthUser, getPubKey } = require('../auth');
const { gun } = require('../index')
const { users } = require('./mock')
let chat = require('../chat')


const currentUser = gun.user()
describe('Chat', () => {
    it(`Global chat`, async () => {
        const boston = await createOrAuthUser(users['boston'])
        await createGlobalUserRoom('Global')
        const rooms = await getRooms()
        const room = Object.keys(rooms).map(k => rooms[k]).find(room => room.name === 'Global')
        expect(room).to.deep.property('name', 'Global')
    })

    it(`Private chat`, async () => {
        const boston = await createOrAuthUser(users['boston'])
        const createPrivate = await createPrivateUserRoom('boston(me) and chicago')
        const createdId = createPrivate['_']['#']
        const rooms = await getRooms()
        const chicagoPubKey = await getPubKey('chicago')   
        currentUser.get('rooms').get(createdId).grant({epub: chicagoPubKey, pub:chicagoPubKey})        
        console.log(rooms) 
        console.log(chicagoPubKey)      
    })
})

function createPrivateUserRoom(name, otherUserPubKey="") {
    return currentUser.get('rooms').set({ name: name, isPrivate: true, users: {} }).then()
}

function createGlobalUserRoom(name) {
    return currentUser.get('rooms').set({ name: name, isPrivate: false, users: {} }).then()
}

function getRooms() {
    return new Promise((resolve, reject) => {
        currentUser.get('rooms').load((data) => {
            resolve(data)
        })
    })
}