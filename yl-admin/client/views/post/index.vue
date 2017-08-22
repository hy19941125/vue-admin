<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <!--搜索选项-->
          <span class="control">
            <input v-model="listQuery.searchinfo" @keyup.13="handleQuery" class="input" type="text" placeholder="请输入书名">
          </span>
          <span class="select">
            <select v-model="listQuery.classify_selected">
              <option v-for="option in classify_options" v-bind:value="option.value">
                {{ option.text }}
              </option>
            </select>
          </span>
          <button class="button is-primary" @click="handleQuery">搜索</button>
          <button class="button is-primary" @click="export2Excel">导出excel</button>

          <br /> 共
          <label id="total">{{total}}</label>条数据

          <table class="table">
            <thead>
              <tr>
                <th>序号
                  <!--<p class="control">
                              <label class="checkbox">
                                <input type="checkbox" v-model="checked" v-on:click='checkedAll'> 全选
                              </label>
                            </p>-->
                </th>
                <th>书名</th>
                <th>作者/出版商</th>
                <th>ISBN</th>
                <th>摘要</th>
                <th>类别</th>
                <th>价格（￥）</th>
                <th>发布价格（￥）</th>
                <th>发布人</th>
                <th>书籍状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) of lists">
                <td>
                  <p class="control">
                    <!--<label class="checkbox">
                                <input type="checkbox" v-model='checkboxModel' :value='item.id'>
                              </label>-->
                    <label>{{index+1+(listQuery.cur-1)*5}}</label>
                  </p>
                </td>
                <td>
                  {{item.name || ' '}}
                </td>
                <td>{{item.book.authorAndPublisher}}</td>
                <td>{{item.book.ISBN}}</td>
                <td>
                  {{item.book.title?item.book.summary.slice(1,50):item.book.summary}}
                  <a class="button is-small is-primary" id="show" @click="item.book.title = !item.book.title">{{item.book.title?'展开':'收起'}}</a>
                </td>
                <td>
                  {{item.classify}}
                </td>
                <td>{{item.book.price}}</td>
                <td>{{item.price}}</td>
                <td>{{item.owner.name}}</td>
                <td>{{item.status}}</td>
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
      showall: false,
      // 获取到的数据
      lists: [],
      // 数据总数
      total: '',
      // 搜索选项
      listQuery: {
        searchinfo: '',
        classify_selected: '-1',
        pageSize: 5,
        cur: 1
      },
      classify_options: [
        { text: '图书类别', value: '-1' },
        { text: '教材教辅', value: 'textBook' },
        { text: '科技商业', value: 'techbook' },
        { text: '小说', value: 'noval' },
        { text: '人文社科', value: 'social' },
        { text: '工具书', value: 'toolBook' },
        { text: '其他', value: 'others' }
      ]
      // 全选状态
      // checkboxModel: [],
      // checked: ''
    }
  },
  computed: {
    all: function () {
      return Math.ceil(this.total / this.listQuery.pageSize)
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
  created() {
    this.getlist()
  },
  watch: {
    'checkboxModel': {
      handler: function (val, oldVal) {
        if (this.checkboxModel.length === this.lists.length) {
          this.checked = true
        } else {
          this.checked = false
        }
      },
      deep: true
    },
    'listQuery.cur': {
      handler: function (oldval, newval) {
        console.log(this.listQuery.cur)
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
        this.getlist()
      }
    },
    'listQuery.searchinfo': {
      handler: function (oldval, newval) {
        if (this.listQuery.searchinfo === '') {
          this.listQuery.cur = 1
          this.getlist()
        }
      }
    },
    'listQuery.classify_selected': {
      handler: function (oldval, newval) {
        if (this.listQuery.classify_selected === '-1') {
          this.listQuery.cur = 1
          this.getlist()
        }
      }
    }
  },
  methods: {
    getlist() {
      this.$lc.Cloud.run('showposts', { listQuery: this.listQuery }).then(rlts => {
        console.log(rlts)
        this.lists = rlts.posts
        this.total = rlts.count._result
      })
    },
    // 翻页
    btnClick: function (data) {
      if (data !== this.listQuery.cur) {
        this.listQuery.cur = data
      }
    },
    // 全选
    // checkedAll: function () {
    //   var _this = this
    //   if (!this.checked) {
    //     _this.checkboxModel = []
    //   } else {
    //     _this.lists.forEach(function (list) {
    //       _this.checkboxModel.push(list.id)
    //     })
    //   }
    // },
    handleQuery: function () {
      this.listQuery.cur = 1
      this.getlist()
    },
    export2Excel: function () {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../vendor/Export2Excel')
        const tHeader = ['书名', '类别', '状态', '发布价格', '查看次数']
        const filterVal = ['name', 'classify', 'status', 'price', 'views']
        const list = this.lists
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '书籍列表')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style lang="scss">
#total {
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
  float: left;
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
