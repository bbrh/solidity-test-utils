async function shouldFail (f) {
  let err = null
  try {
    await f()
  } catch(error) {
    err = error
  }
  assert.ok(err instanceof Error)
}


module.exports = exports = {
  shouldFail: shouldFail
}