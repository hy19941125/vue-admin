<template>
  <div class="content has-text-centered">
    <h1 class="is-title is-bold">Login</h1>

    <div class="columns is-vcentered">
      <div class="column is-6 is-offset-3">
        <div class="box">
          <div v-show="error" style="color:red; word-wrap:break-word;">{{ error }}</div>
          <form v-on:submit.prevent="login">
            <label class="label">用户名</label>
            <p class="control">
              <input v-model="data.body.username" class="input" type="text" placeholder="小程序注册时所填密码">
            </p>
            <label class="label">密码</label>
            <p class="control">
              <input v-model="data.body.password" class="input" type="password" placeholder="小程序注册时所填密码">
            </p>

            <p class="control">
              <label class="checkbox">
                <input type="checkbox" v-model="data.rememberMe"> Remember me
              </label>
            </p>

            <hr>
            <p class="control">
              <button type="submit" class="button is-primary">Login</button>
              <button class="button is-default">Cancel</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  data() {
    return {
      data: {
        body: {
          username: null,
          password: null
        },
        rememberMe: false
      },
      error: null
    }
  },
  beforeMount() {
    if (this.$store.state.app.isLogin) {
      this.$router.go('/test')
    }
  },
  mounted() {
    if (this.$auth.redirect()) {
      console.log('Redirect from: ' + this.$auth.redirect().from.name)
    }
    // Can set query parameter here for auth redirect or just do it silently in login redirect.
  },
  methods: {
    login() {
      var _this = this
      _this.$lc.User.logIn(_this.data.body.username, _this.data.body.password).then(function (logInedUser) {
        _this.$store.dispatch('changeLoginState', true)
        _this.$router.go('/test')
      }, function (error) {
        console.log(JSON.stringify(error))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.is-title {
  text-transform: capitalize;
}
</style>
