const BN = web3.utils.BN


/**
 * Asserts that for all entries in `req` there is a matching value in data
 * Data can have more entries than req
 * Expected structure is the output of `balances` function
 */
function snapshotAssert (req, data) {
  var keys = Object.keys(req)
  for (var i=0; i<keys.length; i++) {
    var contract = keys[i]
    var wallets = Object.keys(req[contract])
    for (var j=0; j<wallets.length; j++) {
      var wallet = wallets[j]
      assert.equal(req[contract][wallet], data[contract][wallet],
        'balance of the token '+contract+' for the wallet '+wallet)
    }
  }
}


/**
 * Returns `b - a`
 * Any keys that is presented in `a` only will be ignored
 * Expected structure is the output of `balances`
 */
function snapshotDifference (before, after) {
  var res = {}
  var keys = Object.keys(after)
  for (var i=0; i<keys.length; i++) {
    var contract = keys[i]
    res[contract] = {}
    var wallets = Object.keys(after[contract])
    for (var j=0; j<wallets.length; j++) {
      var wallet = wallets[j]
      if (before[contract] && before[contract][wallet]) {
        res[contract][wallet] = (after[contract][wallet]).sub(before[contract][wallet])
      } else {
        res[contract][wallet] = after[contract][wallet]
      }
    }
  }
  return res
}


/**
 * Returns balances for each account in `accounts` in every of `contracts`
 */
async function snapshotBalances (contracts, accounts) {
  var res = {}
  for (var i=0; i<contracts.length; i++) {
    if (contracts[i] === 'eth') {
      res['eth'] = await etherMap(accounts)
    } else {
      res[contracts[i].address] = await balanceMap(contracts[i], accounts)
    }
  }
  return res
}


/**
 * returns results of `balanceOf` function in contracts `c` for `accounts`
 */
async function balanceMap (c, accounts) {
  return await valueMap(
    async (a) => new BN(await c.balanceOf(a)),
    accounts
  )
}


/**
 * returns wallet balances in wei for `accounts`
 */
async function etherMap (accounts) {
  return await valueMap(
    async (a) => new BN(await web3.eth.getBalance(a)),
    accounts
  )
}


/**
 * Internal utility function
 * maps async function `fun` over `args`
 */
async function valueMap (fun, args) {
  var res = {}
  for (var i=0; i<args.length; i++) {
    res[args[i]] = await fun(args[i])
  }
  return res
}


module.exports = exports = {
  difference: snapshotDifference,
  assert: snapshotAssert,
  balances: snapshotBalances
}