//index.js
//获取应用实例
const app = getApp()

// 数据过滤器
const filters = {
  all: function (item) {
    return item
  },
  active: function (item) {
    return item.filter(function (item) {
      return item.check == false
    })
  },
  completed: function (item) {
    return item.filter(function (item) {
      return item.check == true
    })
  }
}
let id = 0;
Page({
  data: {
    allLists: [

    ],
    showLists: [

    ],
    dataType: 'all',
    inputVal: null,
    leftItem: 0,
    allChecked: false,
    lastTapDiffTime: 0
  },
  //事件处理函数
  // 添加数据
  add(e) {
    if (e.detail.value == '') {
      wx.showToast({
        title: '请输入',
        icon: 'none',
        duration: 1000
      })
    } else {
      let obj = {}
      obj['id'] = id++;
      obj['value'] = e.detail.value;
      obj['check'] = false;
      obj['edit'] = false;
      let dataType = this.data.dataType
      let allLists = this.data.allLists
      allLists.push(obj)
      this.setData({
        allLists: allLists,
        autofocus: true,
        inputVal: null,
        focus: true
      })
      let type = this.data.dataType
      this.typeLists(type)
      this.leftItems();
    }
  },
  // 单选
  checked(e) {
    console.log(e)
    let id = e.target.dataset.id
    let allLists = this.data.allLists
    console.log(allLists)
    allLists.map(function (item, index) {
      if (item.id == id) {
        item.check = !item.check
      }
    })
    let type = this.data.dataType
    this.typeLists(type)
    this.leftItems();
    let allStatu = null;
    if (this.data.leftItem == 0) {
      allStatu = true
    } else {
      allStatu = false
    }
    this.setData({
      allChecked: allStatu
    })
  },
  // 全选
  checkAll() {
    let allChecked = this.data.allChecked
    let allLists = this.data.allLists
    if (!allChecked) {
      allLists.map(function (item, index) {
        item.check = true
      })
    } else {
      allLists.map(function (item, index) {
        item.check = false
      })
    }
    this.setData({
      allChecked: !allChecked
    })
    let type = this.data.dataType
    this.typeLists(type)
    this.leftItems();
  },
  // 切换数据类型
  changeType(e) {
    let type = e.target.dataset.type
    this.typeLists(type)
    this.setData({
      dataType: type
    })
  },
  // 数据类型显示数据
  typeLists(type) {
    let allLists = this.data.allLists
    this.setData({
      showLists: filters[type](allLists)
    })
  },
  // item left数值
  leftItems() {
    let allLists = this.data.allLists
    let len = filters['active'](allLists).length
    this.setData({
      leftItem: len
    })
  },
  // 移除单个
  removeItem(e) {
    let index = e.target.dataset.index
    let allLists = this.data.allLists
    allLists.splice(index, 1)
    let allChecked = this.data.allChecked
    if (allLists.length == 0) {
      allChecked = false
    }
    this.setData({
      allLists: allLists,
      allChecked: allChecked
    })
    let type = this.data.dataType
    this.typeLists(type)
    this.leftItems();
  },
  // 移除多个
  removeSelect() {
    let allLists = this.data.allLists
    let activeData = filters['active'](allLists)
    let allChecked = this.data.allChecked

    this.setData({
      allLists: activeData,
      showLists: activeData
    })
    if (activeData.length == 0) {
      this.setData({
        allChecked: false
      })
    }
    let type = this.data.dataType
    this.typeLists(type)
  },
  // 双击编辑
  edit(e) {
    let id = e.target.dataset.id
    let curTime = e.timeStamp
    let lastTime = this.data.lastTapDiffTime
    let allLists = this.data.allLists
    let that = this
    if (lastTime > 0) {
      if (curTime - lastTime < 300) {
        allLists.map(function (item, index) {
          if (item.id == id) {
            let list = 'allLists[' + index + '].edit'
            that.setData({
              [list]: true
            })
          }
        })
        let type = this.data.dataType
        this.typeLists(type)
      }
    }
    this.setData({
      lastTapDiffTime: curTime
    })
  },
  editBlur(e) {
    let id = e.target.dataset.id
    let newVal = e.detail.value
    let allLists = this.data.allLists
    let allChecked = this.data.allChecked
    let that = this;
    allLists.map(function (item, index) {
      if (item.id == id) {       
        if (newVal == ''){
          allLists.splice(index,1)        
          if (allLists.length == 0){
            that.setData({
              allChecked: false
            })
          }
          that.setData({
            allLists: allLists
          })
        }else{
          let edit = 'allLists[' + index + '].edit'
          let val = 'allLists[' + index + '].value'
          that.setData({
            [edit]: false,
            [val]: newVal
          })
        }
      }      
    })
    let type = this.data.dataType
    this.typeLists(type)
  }

})
