import * as types from '../../mutation-types'
import lazyLoading from './lazyLoading'

// show: meta.label -> name
// name: component name
// meta.label: display label

const state = {
  items: [
    {
      name: '总览',
      path: '/overview',
      meta: {
        icon: 'fa-tachometer',
        link: 'overview/index.vue'
      },
      component: lazyLoading('overview', true)
    },
    {
      name: '用户管理',
      path: '/user',
      meta: {
        icon: 'fa-tachometer',
        link: 'user/index.vue'
      },
      component: lazyLoading('user', true)
    },
    {
      name: '交易管理',
      path: '/transac',
      meta: {
        icon: 'fa-tachometer',
        link: 'transac/index.vue'
      },
      component: lazyLoading('transac', true)
    },
    {
      name: '书籍管理',
      path: '/post',
      meta: {
        icon: 'fa-tachometer',
        link: 'post/index.vue'
      },
      component: lazyLoading('post', true)
    },
    {
      name: '审核管理',
      path: '/verify',
      meta: {
        icon: 'fa-tachometer',
        link: 'verify/index.vue'
      },
      component: lazyLoading('verify', true)
    },
    {
      name: '测试',
      path: '/test',
      meta: {
        icon: 'fa-rocket',
        link: 'test/index.vue'
      },
      component: lazyLoading('test', true)
    }
  ]
}

const mutations = {
  [types.EXPAND_MENU](state, menuItem) {
    if (menuItem.index > -1) {
      if (state.items[menuItem.index] && state.items[menuItem.index].meta) {
        state.items[menuItem.index].meta.expanded = menuItem.expanded
      }
    } else if (menuItem.item && 'expanded' in menuItem.item.meta) {
      menuItem.item.meta.expanded = menuItem.expanded
    }
  }
}

export default {
  state,
  mutations
}
