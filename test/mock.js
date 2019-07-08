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

module.exports = {
  users,
  unExistusers,
  wrongPasswordUsers
}