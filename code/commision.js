const BN = web3.utils.BN


async function totalCommissions (startBlock, endBlock) {
  var res = { 'eth': {} }
  for (var i=startBlock+1; i<=endBlock; i++) {
    var block = await web3.eth.getBlock(i)
    for (var j=0; j<block.transactions.length; j++) {
      var tx = await web3.eth.getTransaction(block.transactions[j])
      var txR = await web3.eth.getTransactionReceipt(block.transactions[j])
      if (!res.eth[tx.from]) {
        res.eth[tx.from] = new BN(0)
      }
      var gasPrice = new BN(tx.gasPrice)
      var gasUsed = new BN(txR.cumulativeGasUsed)
      res.eth[tx.from] = res.eth[tx.from].sub(gasPrice.mul(gasUsed))
    }
  }
  return res
}


module.exports = exports = {
  totalCommissions: totalCommissions
}