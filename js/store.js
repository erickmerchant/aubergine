module.exports = function (commit) {
  commit(function () {
    return {
      value: 0,
      id: null,
      message: null
    }
  })

  return function (value, message) {
    const end = Date.now() + value + 1000

    commit(function (state) {
      state.message = null

      if (state.id) {
        clearTimeout(state.id)
      }

      cycle()

      state.value = value

      return state
    })

    function cycle () {
      const value = end - Date.now()

      commit(function (state) {
        state.value = value

        if (value > 1000) {
          state.id = setTimeout(cycle, 100)
        } else {
          state.message = message
        }

        return state
      })
    }
  }
}
