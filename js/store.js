module.exports = function (commit) {
  commit(function () {
    return {
      value: 0,
      id: null,
      message: null
    }
  })

  return {
    set (value, message) {
      const end = Date.now() + value + 1000

      commit(function (state) {
        state.message = null

        if (state.id) {
          clearTimeout(state.id)
        }

        cycle({end, message})

        state.value = value

        return state
      })
    }
  }

  function cycle ({end, message}) {
    const value = end - Date.now()

    commit(function (state) {
      state.value = value

      if (value > 1000) {
        state.id = setTimeout(cycle, 100, {end, message})
      } else {
        state.message = message
      }

      return state
    })
  }
}
