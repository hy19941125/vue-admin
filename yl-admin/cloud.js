var AV = require('leanengine')

var Book = AV.Object.extend('Book')
var utils = require('./utils/utils')
/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function (request, response) {
  response.success('Hello world!')
})
var userStruct = user => {
  const { name, gender, school, card, major, nickName, mobilePhoneNumber, mobilePhoneVerified, cardVerifiedFlag } = user.attributes
  return {
    name,
    gender: utils.getGender(gender),
    school,
    card,
    major,
    nickName,
    mobilePhoneNumber,
    isverified: utils.getVerified(mobilePhoneVerified, cardVerifiedFlag)
  }
}
var alllistsStruct = list => {
  const { name, status, views, price, classify } = list.attributes
  return {
    name,
    status: utils.getStatus(status),
    id: list.id,
    classify: utils.getClassify(classify),
    price: utils.strimPrice(price),
    views
  }
}
var postStruct = post => {
  const { name, status, views, book, price, classify } = post.attributes
  return {
    name,
    views,
    status: utils.getStatus(status),
    id: post.id,
    classify: utils.getClassify(classify),
    book: {
      title: book.get("title"),
      imageUrl: book.get("imageUrl"),
      authorAndPublisher: utils.authorAndPublisher(book.get("author"), book.get("publisher")),
      price: utils.strimPrice(book.get("price")),
      id: book.id,
      summary: book.get("summary"),
      ISBN: book.get('isbn13')
    },
    price: utils.strimPrice(price),
    since: utils.since(post.createdAt),
    owner: {
      id: post.get("owner").id,
      name: post.get("owner").get("nickName")
    }
  }
}

// user部分
AV.Cloud.define('showusers', function (req, res) {
  var listQuery = req.params.listQuery
  var school = listQuery.school
  var results = []
  // var gender = listQuery.gender
  var page = (listQuery.cur - 1) * 15
  if (school) {
    const query = new AV.Query('_User')
    query.equalTo('school', school).skip(page).limit(15).find().then(users => {
      results.push(users.map(userStruct))
      const count = users.length
      results.push(count)
      res.success(results)
    })
  } else {
    const query = new AV.Query('_User')
    query.skip(page).limit(15).find().then(users => {
      results.push(users.map(userStruct))
      const count = users.length
      results.push(count)
      res.success(results)
    })
  }
})


// test部分
AV.Cloud.define('showVIP', function (req, res) {
  var listQuery = req.params.listQuery
  var phone = listQuery.searchphone
  var cur = listQuery.cur
  if (phone) {
    const query3 = new AV.Query('_User')
    query3.equalTo('mobilePhoneNumber', phone)
    const query1 = new AV.Query('_User')
    query1.equalTo('mobilePhoneVerified', true)
    const query2 = new AV.Query('_User')
    query2.equalTo('cardVerifiedFlag', 1)
    const query = AV.Query.and(query1, query2, query3)
    query.skip((cur - 1) * 20).limit(20).find().then(users => {
      res.success(users)
    })
  } else {
    const query1 = new AV.Query('_User')
    query1.equalTo('mobilePhoneVerified', true)
    const query2 = new AV.Query('_User')
    query2.equalTo('cardVerifiedFlag', 1)
    const query = AV.Query.and(query1, query2)
    query.skip((cur - 1) * 20).limit(20).find().then(users => {
      res.success(users)
    })
  }
})

AV.Cloud.define('clearUserMsg', function (req, res) {
  const id = req.params.id
  const user = AV.Object.createWithoutData('_User', id)
  user.set('mobilePhoneVerified', false)
  user.set('cardVerifiedFlag', 0)
  user.save().then((user) => {
    res.success(user)
  })
})

// 书籍部分
AV.Cloud.define('showposts', function (req, res) {
  var listQuery = req.params.listQuery
  var curpage = listQuery.cur
  var name = listQuery.searchinfo
  var classify = listQuery.classify_selected
  var page = (curpage - 1) * 5
  if (name === '' && classify === '-1') {
    const query = new AV.Query('Post')
    const count = query.count('Post')
    query.include('book').include('owner').skip(page).limit(5).find().then(posts => {
      if (!posts.length) return []
      return posts.map(postStruct)
    }).then(posts => {
      res.success({ posts, count })
    }).catch(err => {
      res.success(err)
    })
  }// 'ok
  if (name !== '' && classify !== '-1') {
    const query1 = new AV.Query('Post')
    query1.matches('name', new RegExp(name, 'i'))
    const query2 = new AV.Query('Post')
    query2.equalTo('classify', classify)
    const query = AV.Query.and(query1, query2)
    const count = query.count('Post')
    query.include('book').include('owner').skip(page).limit(5).find().then(posts => {
      if (!posts.length) return []
      return posts.map(postStruct)
    }).then(posts => {
      res.success({ posts, count })
    }).catch(err => {
      res.success(err)
    })
  }// 'ok
  if (name === '' && classify !== '-1') {
    const query = new AV.Query('Post')
    query.equalTo('classify', classify)
    const count = query.count('Post')
    query.include('book').include('owner').skip(page).limit(5).find().then(posts => {
      if (!posts.length) return []
      return posts.map(postStruct)
    }).then(posts => {
      res.success({ posts, count })
    }).catch(err => {
      res.success(err)
    })
  }
  if (name !== '' && classify === '-1') {
    const query = new AV.Query('Post')
    query.matches('name', new RegExp(name, 'i'))
    const count = query.count('Post')
    query.include('book').include('owner').skip(page).limit(5).find().then(posts => {
      if (!posts.length) return []
      return posts.map(postStruct)
    }).then(posts => {
      res.success({ posts, count })
    }).catch(err => {
      res.success(err)
    })
  }
})
AV.Cloud.define('getAllLists', async function (req, res) {
  const query = new AV.Query('Post')
  let lists = await query.find()
  lists = lists.map(alllistsStruct)
  res.success(lists)
})
