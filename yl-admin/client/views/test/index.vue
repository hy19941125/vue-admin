<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">

          <!--操作-->
          <span class="control">
            <input v-model="listQuery.searchphone" class="input" type="text" placeholder="请输入手机号">
          </span>
          <button class="button is-primary" @click="handleFilter">搜索</button>
          <br>
          共<label id="total">{{total}}</label>条数据
          <!--表格-->
          <table class="table">
            <thead>
              <tr>
                <th>
                  <!--<p class="control">
                      <label class="checkbox">
                        <input type="checkbox" v-model="checked" v-on:click='checkedAll'> 全选
                      </label>
                    </p>-->
                  序号
                </th>
                <th>ID</th>
                <th>微信昵称</th>
                <th>手机号</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user,index) of users">
                <td>
                  <p class="control">
                    <!--<label class="checkbox">
                        <input type="checkbox" v-model='checkboxModel' :value='user.objectId'>
                      </label>-->
                    <label>{{(index+1)+(listQuery.cur-1)*20}}</label>
                  </p>
                </td>
                <td>{{user.objectId}}
                  <td>{{user.nickName}}</td>
                  <td>{{user.mobilePhoneNumber}}</td>
                  <td>
                    <button class="button is-primary" @click="ClearUserInfo(user.objectId,index)">清除信息</button>
                  </td>
              </tr>
            </tbody>
          </table>
          <div class="page-bar">
            <ul>
              <li v-if="showFirst">
                <a v-on:click="listQuery.cur--">上一页</a>
              </li>
              <li v-for="index in indexs" v-bind:class="{ 'active': listQuery.cur == index}">
                <a v-on:click="btnClick(index)">{{ index }}</a>
              </li>
              <li v-if="showLast">
                <a v-on:click="listQuery.cur++">下一页</a>
              </li>
              <li>
                <a>共
                  <i>{{all}}</i>页</a>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: '',
      users: [],
      checkboxModel: [],
      checked: '',
      pageSize: 20,
      listQuery: {
        searchphone: '',
        cur: 1
      }
    }
  },
  created() {
    this.getlists()
  },
  computed: {
    all: function () {
      return Math.ceil(this.users.length / this.pageSize)
    },
    indexs: function () {
      var left = 1
      var right = this.all
      var ar = []
      if (this.all >= 11) {
        if (this.listQuery.cur > 5 && this.listQuery.cur < this.all - 4) {
          left = this.listQuery.cur - 5
          right = this.listQuery.cur + 4
        } else {
          if (this.listQuery.cur <= 5) {
            left = 1
            right = 10
          } else {
            right = this.all
            left = this.all - 9
          }
        }
      }
      while (left <= right) {
        ar.push(left)
        left++
      }
      return ar
    },
    showLast: function () {
      if (this.listQuery.cur === this.all) {
        return false
      }
      return true
    },
    showFirst: function () {
      if (this.listQuery.cur === 1) {
        return false
      }
      return true
    }
  },
  watch: {
    'checkboxModel': {
      handler: function (val, oldVal) {
        if (this.checkboxModel.length === this.users.length) {
          this.checked = true
        } else {
          this.checked = false
        }
      },
      deep: true
    },
    'listQuery.cur': {
      handler: function (oldval, newval) {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
        this.getlists()
      }
    },
    'listQuery.searchphone': {
      handler: function (val, oldVal) {
        if (!this.listQuery.searchphone) {
          this.getlists()
        }
      }
    }
  },
  methods: {
    btnClick: function (data) {
      if (data !== this.listQuery.cur) {
        this.listQuery.cur = data
      }
    },
    ClearUserInfo: function (el, index) {
      this.$lc.Cloud.run('clearUserMsg', { id: el }).then(rlt => {
        if (rlt) {
          console.log(index)
          this.users.splice(index, 1)
        }
      })
    },
    ClearByGroup: function () {
      var _this = this
      _this.checkboxModel.forEach(function (el, index) {
        _this.$lc.Cloud.run('clearUserMsg', { id: el }).then(rlt => {
          if (rlt) {
            _this.filterUsers.splice(index, 1)
          }
        })
      })
    },
    checkedAll: function () {
      var _this = this
      if (!this.checked) {
        _this.checkboxModel = []
      } else {
        _this.filterUsers.forEach(function (user) {
          _this.checkboxModel.push(user.objectId)
        })
      }
    },
    getlists: function () {
      this.$lc.Cloud.run('showVIP', { listQuery: this.listQuery }).then(users => {
        this.users = users
        this.total = users.length
      })
    },
    handleFilter: function () {
      this.getlists()
    }
  }
}
</script>

<style lang="scss">
#total{
  font-weight: bold
}
.table-responsive {
  display: block;
  width: 100%;
  min-height: .01%;
  overflow-x: auto;
}

.input {
  width: 200px;
  float: left
}

ul,
li {
  margin: 0px;
  padding: 0px;
}

li {
  list-style: none
}

.page-bar li:first-child>a {
  margin-left: 0px
}

.page-bar a {
  border: 1px solid #ddd;
  text-decoration: none;
  position: relative;
  float: left;
  padding: 6px 12px;
  margin-left: -1px;
  line-height: 1.42857143;
  color: #337ab7;
  cursor: pointer
}

.page-bar a:hover {
  background-color: #eee;
}

.page-bar .active a {
  color: #fff;
  cursor: default;
  background-color: #337ab7;
  border-color: #337ab7;
}

.page-bar i {
  font-style: normal;
  color: #d44950;
  margin: 0px 4px;
  font-size: 12px;
}
</style>
