<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <input v-model="listQuery.school" @keyup.13="handleSearch" class="input" type="text" placeholder="请输入学校名">
          <!--可按回车实现搜索-->

          <!--<span class="select">
                <select v-model="listQuery.gender">
                  <option v-for="option in sex_options" v-bind:value="option.value">
                    {{ option.text }}
                  </option>
                </select>
              </span>
              <label>{{listQuery.gender}}</label>-->
          <!--<label>{{listQuery.school}}</label>-->
          <!--<span class="select">
                        <select v-model="listQuery.isverified">
                          <option v-for="option in veri_options" v-bind:value="option.value">
                            {{ option.text }}
                          </option>
                        </select>
                      </span>-->
          <!--<input v-model="listQuery.name" class="input" type="text" placeholder="请输入姓名或微信名">-->
          <button class="button is-primary" @click="handleSearch">搜索</button>
          <button class="button is-primary" @click="export2Excel">导出excel</button>
          <br /> 共
          <label id="total">{{total}}</label>条数据
          <table class="table">
            <thead>
              <tr>
                <th>
                  序号</th>
                <th>姓名</th>
                <th>性别</th>
                <th>学校</th>
                <th>学号</th>
                <th>专业</th>
                <th>微信昵称</th>
                <th>手机号</th>
                <th>手机是否认证</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user,index) of users">
                <td>
                  <!--<p class="control">
                                                <label class="checkbox">
                                                  <input type="checkbox" v-model='checkboxModel' :value='user.objectId'>
                                                </label>
                                              </p>-->
                  {{index+1+(listQuery.cur-1)*10}}
                </td>
                <td>{{user.name}}</td>
                <td>{{user.gender}}</td>
                <td>{{user.school}}</td>
                <td>{{user.card}}</td>
                <td>{{user.major}}</td>
                <td>{{user.nickName}}</td>
                <td>{{user.mobilePhoneNumber}}</td>
                <td>{{user.isverified}}</td>
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
      pageSize: 15,
      users: [],
      listQuery: {
        // gender: '-1',
        school: '',
        cur: 1
      },
      total: ''
      // veri_options: [
      //   { text: '是否认证', value: -1 },
      //   { text: '已认证', value: 1 },
      //   { text: '未认证', value: 0 }
      // ],
      // sex_options: [
      //   { text: '性别', value: -1 },
      //   { text: '男', value: 1 },
      //   { text: '女', value: 0 }
      // ]
    }
  },
  watch: {
    'checkboxModel': {
      handler: function (val, oldVal) {
        if (this.checkboxModel.length === this.total) {
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
    'listQuery.school': {
      handler: function (oldval, newval) {
        if (!this.listQuery.school) {
          this.getlists()
        }
      }
    }
  },
  created() {
    // console.log(typeof this.listQuery.school)
    // console.log(this.listQuery.gender)
    // console.log(this.listQuery.cur)
    this.getlists()
  },
  computed: {
    all: function () {
      return Math.ceil(this.total / this.pageSize)
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
  methods: {
    handleSearch: function () {
      this.getlists()
    },
    btnClick: function (data) {
      if (data !== this.listQuery.cur) {
        this.listQuery.cur = data
      }
    },
    getlists: function () {
      this.$lc.Cloud.run('showusers', { listQuery: this.listQuery }).then(rlts => {
        this.users = rlts[0]
        this.total = rlts[1]
        console.log(rlts)
      })
    },
    export2Excel: function () {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../vendor/Export2Excel')
        const tHeader = ['姓名', '性别', '学校', '学号', '专业', '微信昵称', '手机号', '手机是否认证']
        const filterVal = ['name', 'gender', 'school', 'card', 'major', 'nickName', 'mobilePhoneNumber', 'isverified']
        const list = this.users
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '用户列表')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style lang="scss">
.table-responsive {
  display: block;
  width: 100%;
  min-height: .01%;
  overflow-x: auto;
}

.input {
  width: 200px
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

#total {
  font-weight: bold
}
</style>
