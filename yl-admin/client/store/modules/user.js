import * as types from '../mutation-types'

const state = {
  isLogin: true
}
const mutations = {
  [types.CHANGE_LOGIN_STATE](state, param) {
    state.isLogin = param
  }
}
export default {
  state,
  mutations
}
