"use strict";

const BN = web3.utils.BN;
const snapshots = require('./snapshots.js');
const commission = require('./commision.js');


/**
 * Internal utility function
 * returns set of wallets that is used in `d`
 */
function extractWallets (d) {
  var res = {}
  var keys = Object.keys(d)
  for (var i=0; i<keys.length; i++) {
    var wallets = Object.keys(d[keys[i]])
    for (var j=0; j<wallets.length; j++) {
      res[wallets[j]] = 1
    }
  }
  return Object.keys(res)
}

/**
 * Internal utility function
 * returns contract instances from module's internal storage
 */
function extractContracts (d) {
  var res = []
  var addresses = Object.keys(d)
  for (var i=0; i<addresses.length; i++) {
    if (addresses[i] === 'eth') {
      res.push('eth')
    } else {
      res.push(contracts[addresses[i]])
    }
  }
  return res
}


function makeBN (d) {
  var addresses = Object.keys(d)
  for (var i=0; i<addresses.length; i++) {
    var wallets = d[addresses[i]]
    for (var j=0; i<wallets.length; i++) {
      d[addresses[i]][wallets[j]] = new BN(d[addresses[i]][wallets[j]])
    }
  }
  return d
}

/**
 * Ensures that after executing async function `f`,
 * balances are changed according to `expected`
 */
async function shouldChangeBalance (f, expected) {
  expected = makeBN(expected)
  var accounts = extractWallets(expected)
  var contracts = extractContracts(expected)
  var before = await snapshots.balances(contracts, accounts)
  var blockNumberBefore = await web3.eth.getBlockNumber()

  await f()

  var after = await snapshots.balances(contracts, accounts)
  var blockNumberAfter = await web3.eth.getBlockNumber()
  var ethCommission = await commission.totalCommissions(blockNumberBefore, blockNumberAfter)

  var delta = snapshots.difference(before, after)
  delta = snapshots.difference(ethCommission, delta)

  snapshots.assert(expected, delta)
}

/**
 * Saves `contract` for later use
 */
function register (contract) {
  contracts[contract.address] = contract
}

const contracts = {}

module.exports = exports = {
  contracts,
  'assertChange': shouldChangeBalance,
  'register': register
}