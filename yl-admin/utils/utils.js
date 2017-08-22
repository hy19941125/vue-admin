module.exports = {
  since(timestamp) {
    // TODO...
    return getDateDiff(timestamp)
  },
  strimPrice(price) {
    return /\d+\.*\d*/.exec(price) ? Number.parseFloat(/\d+\.*\d*/.exec(price)[0]).toFixed(2) : null
  },
  authorAndPublisher(author, publisher) {
    const _authorAndPublisher = []
    author && author.length !== 0 ? _authorAndPublisher.push(author.join(', ')) : null
    publisher ? _authorAndPublisher.push(publisher) : null
    return _authorAndPublisher.join(' / ')
  },
  getStatus(status) {
    switch (status) {
      case 100:
        return '卖家挂单，可以购买'
      case 101:
        return '交易进行中'
      case 200:
        return '交易完成'
      case 401:
        return '已下架'
    }
  },
  getClassify(classify) {
    switch (classify) {
      case 'textBook':
        return '教材教辅'
      case 'techbook':
        return '科技商业'
      case 'noval':
        return '小说'
      case 'social':
        return '人文社科'
      case 'toolBook':
        return '工具书'
      case 'others':
        return '其他'
    }
  },
  getGender(gender) {
    switch (gender) {
      case 1:
        return '男'
      case 0:
        return '女'
    }
  },
  getVerified(mobilePhoneVerified, cardVerifiedFlag) {
    if (mobilePhoneVerified && cardVerifiedFlag) {
      return '已认证'
    } else {
      return '未认证'
    }
  }
}

function getDateTimeStamp(dateStr) {
  return Date.parse(dateStr)
}

function getDateDiff(dateStr) {
  var publishTime = getDateTimeStamp(dateStr) / 1000
  var d_seconds
  var d_minutes
  var d_hours
  var d_days
  var timeNow = parseInt(new Date().getTime() / 1000)
  var d

  var date = new Date(publishTime * 1000)
  var Y = date.getFullYear()
  var M = date.getMonth() + 1
  var D = date.getDate()
  var H = date.getHours()
  var m = date.getMinutes()
  var s = date.getSeconds()
  // 小于10的在前面补0
  if (M < 10) {
    M = '0' + M
  }
  if (D < 10) {
    D = '0' + D
  }
  if (H < 10) {
    H = '0' + H
  }
  if (m < 10) {
    m = '0' + m
  }
  if (s < 10) {
    s = '0' + s
  }

  d = timeNow - publishTime
  d_days = parseInt(d / 86400)
  d_hours = parseInt(d / 3600)
  d_minutes = parseInt(d / 60)
  d_seconds = parseInt(d)

  if (d_days > 0 && d_days < 3) {
    return d_days + '天前'
  } else if (d_days <= 0 && d_hours > 0) {
    return d_hours + '小时前'
  } else if (d_hours <= 0 && d_minutes > 0) {
    return d_minutes + '分钟前'
  } else if (d_seconds < 60) {
    if (d_seconds <= 0) {
      return '刚刚发表'
    } else {
      return d_seconds + '秒前'
    }
  } else if (d_days >= 3 && d_days < 30) {
    return M + '-' + D + ' ' + H + ':' + m
  } else if (d_days >= 30) {
    return Y + '-' + M + '-' + D + ' ' + H + ':' + m
  }
}
