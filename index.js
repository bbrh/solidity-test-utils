const timeUtils = require('./code/time.js')
const balanceUtils = require('./code/balance.js')
const fail = require('./code/fail.js')

module.exports = exports = {
  time: timeUtils,
  balance: balanceUtils,
  shouldFail: fail.shouldFail
}