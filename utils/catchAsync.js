// Try catch block in async function gets duplicate
// This function receive a async function
// Then return another function which attaches to express router
// So that we can get req, res and next
// Then we call the async function we passed in
// Since async function returns a promise so we can catch it in much better way
const catchAsync = (asyncFunc) => (req, res, next) => {
  asyncFunc(req, res, next).catch(next)
}

module.exports = catchAsync
