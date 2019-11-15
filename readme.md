# Solidity-test-utils

Set of testing utilities

Install module
```sh
  npm i solidity-test-utils
```
Import module
```js
  const u = require('solidity-test-utils')
```

## Content

* `u.balance.assertChange`
* `u.shouldFail`
* `u.time.forward` from this https://medium.com/edgefund/time-travelling-truffle-tests-f581c1964687

## Details

### `u.balance.assertChange`

Asserts that balance has changed after function call.

#### Step 1 - register your contarcts

Register abi and address for token contract with `u.balance.register`. You only
need to do this once per contract.

Should be a nicer way of getting ABIs of truffle deployed contracts.
```js
contract("Crowdsale", async accounts => {

  before( async () => {
    ...
    tokenA = await TokenA.deployed()
    u.balance.register(tokenA)
    ...
  })

  ...
```

#### Step 2 - test your function

Here is an example that test function `crtowdsale.buyTokens`. This code will
ensure that after execution:

1) `accounts[2]` will increare balance of `tokenA` by `amt` tokens;
2) wallet `accounts[2]` will pay `totalWeiPaid` wei
3) wallet `accounts[1]` will receive `totalWeiPaid` wei from the (2)

```js
  it('Can purchase tokens', async () => {
    var totalWeiPaid = 999
    var amt = 111

    await u.balance.assertChange(
      async () => {
        await crowdsale.buyTokens({
          from: accounts[2],
          value: totalWeiPaid
        })
      }, {
        [tokenA.address]: { accounts[2] : amt },
        'eth': {
          accounts[1] : totalWeiPaid,
          accounts[2] : -totalWeiPaid
        }
      }
    )
  })
```

##### Tx Commission

Is calculated and accounted [automatically](code/commission.js) inside

##### Why square brackets in `[tokenA.address]`?

To get value of `tokenA.address` and use it as object key

##### Why positive and negative numbers?

Positives are for balance increase and negatives are for deductions.

##### How to check for `ether` balance?

Use `'eth'` instead of token address

##### My token have non-standard way of getting balance?

Check [this code](code/snapshots.js?L69), should be easy to extend.

### `u.shouldFail(f)`

Asserts that executing `async` function `f` will result in tx revert.

```js
await u.shouldFail(
  async () => crowdsale.doSomethingThatIsNotPossible()
)
```

### `u.time.forward`

Nice way to test time-dependent logic in `truffle` and `ganache`
Code is from https://medium.com/edgefund/time-travelling-truffle-tests-f581c1964687

```js
await u.time.travel(freezeTime)
```