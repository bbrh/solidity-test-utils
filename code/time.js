// advance time and block
// source https://medium.com/edgefund/time-travelling-truffle-tests-f581c1964687

async function advanceTimeAndBlock (time) {
  await advanceTime(time)
  await advanceBlock()

  return Promise.resolve(web3.eth.getBlock('latest'))
}

async function advanceTime (time) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [time],
      id: new Date().getTime()
    }, (err, result) => {
      if (err) {
        return reject(err)
      }
      return resolve(result)
    })
  })
}

async function advanceBlock () {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_mine',
      id: new Date().getTime()
    }, (err, result) => {
      if (err) {
        return reject(err)
      }
      const newBlockHash = web3.eth.getBlock('latest').hash

      return resolve(newBlockHash)
    })
  })
}

module.exports = exports = {
  travel: advanceTimeAndBlock
}