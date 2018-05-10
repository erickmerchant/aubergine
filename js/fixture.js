module.exports = function (commit) {
  commit(function () {
    return {
      value: 300000,
      location: '/snapshots/break.html'
    }
  })

  commit(function () {
    return {
      value: 0,
      location: '/snapshots/reset.html'
    }
  })

  commit(function () {
    return {
      value: 1500000,
      location: '/snapshots/work.html'
    }
  })
}
