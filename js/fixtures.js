module.exports = function (commit) {
  commit(function () {
    return {
      value: 300000,
      location: '/break.html'
    }
  })

  commit(function () {
    return {
      value: 0,
      location: '/reset.html'
    }
  })

  commit(function () {
    return {
      value: 1500000,
      location: '/work.html'
    }
  })
}
