var Gun = require('gun');
var gun = Gun();
var SEA = Gun.SEA;
require('gun/lib/then')
require('gun/lib/load')

module.exports = {
    gun,
    SEA
}