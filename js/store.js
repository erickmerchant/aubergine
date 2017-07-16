module.exports = function (seed) {
  seed({
    value: 0,
    id: null,
    message: null
  })

  return function (commit, value, message) {
    const end = Date.now() + value + 1000

    commit((state) => {
      state.message = null

      if (state.id) {
        clearTimeout(state.id)
      }

      let id = setTimeout(cycle, 100)

      return {
        value,
        id
      }
    })

    function cycle () {
      const value = end - Date.now()

      commit((state) => {
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
