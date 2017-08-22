import * as types from '../mutation-types'

const state = {
  device: {
    isMobile: false,
    isTablet: false
  },
  sidebar: {
    opened: false,
    hidden: false
  },
  effect: {
    translate3d: true
  },
  isLogin: false
}

const mutations = {
  [types.TOGGLE_DEVICE](state, device) {
    state.device.isMobile = device === 'mobile'
    state.device.isTablet = device === 'tablet'
  },

  [types.TOGGLE_SIDEBAR](state, config) {
    if (state.device.isMobile && config.hasOwnProperty('opened')) {
      state.sidebar.opened = config.opened
    } else {
      state.sidebar.opened = true
    }

    if (config.hasOwnProperty('hidden')) {
      state.sidebar.hidden = config.hidden
    }
  },

  [types.SWITCH_EFFECT](state, effectItem) {
    for (const name in effectItem) {
      state.effect[name] = effectItem[name]
    }
  },
  [types.CHANGE_LOGIN_STATE](state, param) {
    state.isLogin = param
  }
}

export default {
  state,
  mutations
}
