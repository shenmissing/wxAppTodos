//index.js
//获取应用实例
const app = getApp()
let allLists = [];
let id = 0;
let filters = {
  all: function (lists) {
    return lists
  },
  active: function (lists) {
    return lists.filter(function (item) {
      return item.showIcon == false
    })
  },
  completed: function (lists) {
    return lists.filter(function (item) {
      return item.showIcon == true
    })
  }
}
Page({
  data: {
    inputVal: '',
    lists: [],
    focus: false,
    leftItem: 0,
    allSelect: false,
    pageType: 'all',
    lastTapDiffTime: 0,
    editList:{},
    noList:[],
    completedData:[]
  },
  //事件处理函数
  add(e) {
    if (e.detail.value == '') {
      wx.showToast({
        title: '请输入',
        icon: 'none',
        duration: 1000
      })
    } else {
      let obj = {}     
      obj['value'] = e.detail.value;
      obj['showIcon'] = false;
      obj['dbtap'] = false;
      obj['id'] = id++;
      allLists.push(obj)
      let len = this.data.leftItem + 1
      let pageType = this.data.pageType
      let arr = filters[pageType](allLists)
      let noList = filters['all'](allLists)
      this.setData({
        lists: arr,
        focus: true,
        inputVal: '',
        leftItem: len,
        allSelect: false,
        noList: noList
      })

    }
  },
  checkedStatu(e) {
    let index = e.target.dataset.index;
    let icon = this.data.lists[index].showIcon
    let list = 'lists[' + index + '].showIcon'
    let len = this.data.leftItem
    if (!icon) {
      len--
    } else {
      len++
    }
    let allSel = false
    if (len == 0) {
      allSel = true
    }
   
    this.setData({
      [list]: !icon,
      leftItem: len,
      allSelect: allSel
      
    })
   
    
    allLists = this.data.lists;
    let pageType = this.data.pageType
    let completedData = filters['completed'](allLists)
    console.log(completedData)
    this.setData({     
      completedData: completedData
    })
  },
  allSelect() {
    let select = this.data.allSelect
    let lists = this.data.lists
    let pageType = this.data.pageType
    let len = 0
    if (!select) {
      lists.map(function (item) {
        item.showIcon = true
      })
    } else {
      lists.map(function (item) {
        item.showIcon = false
      })
      len = lists.length
    }
    this.setData({
      lists: lists,
      allSelect: !select,
      leftItem: len
    })
    allLists = this.data.lists;
  },
  remove(e) {
    let lists = this.data.lists
    let index = e.target.dataset.index;
    let allCheckShow = true   
    allLists.map(function(item,idx){
      if(item.id == lists[index].id){
        allLists.splice(idx,1)
      }
    })
    let pageType = this.data.pageType
    let newLists = filters[pageType](allLists)
    if (lists.length == 0) {
      allCheckShow = false
    }
    console.log(lists,allLists)
    let noList = filters['all'](allLists)   
    this.setData({
      lists: newLists,
      noList: noList
    })
  },
  clearSelect() {
    let pageType = this.data.pageType
    for (let i = 0; i < allLists.length; i++){
      if (allLists[i].showIcon) {
        allLists.splice(i, 1)
        i--
      }
    }
    console.log(allLists)
    let lists = filters[pageType](allLists)
    let noList = filters['all'](allLists)   
    this.setData({
      lists: lists,
      noList: noList
    })
  },
  changeType(e) {
    let type = e.target.dataset.type
    console.log(type)
    let lists = filters[type](allLists)
    console.log(lists)
    this.setData({
      lists: lists,
      pageType: type
    })
  },
  Edit(e) {
    let curTime = e.timeStamp
    let lastTime = this.data.lastTapDiffTime
    let index = e.target.dataset.index;
    let list = this.data.lists[index]
    let dbtap = this.data.lists[index].dbtap
    let lists = 'lists[' + index + '].dbtap'

    if (lastTime > 0) {
      if (curTime - lastTime < 300) {
        console.log(e.timeStamp + '--db tap')
        this.setData({
          [lists]:!dbtap,
          editList: list
        })
      } else {
        console.log(e.timeStamp + '-- tap')
      }
    } else {
      console.log(e.timeStamp + ' first tap')
    }
    this.setData({
      lastTapDiffTime: curTime
    })
  },
  editBlur(e){
    console.log(e.target.dataset.index)
    let val = e.detail.value;
    let list = this.data.editList;
    let lists = this.data.lists
    let index = e.target.dataset.index
    if(val==''){
      lists.splice(index,1)
      let id = list.id
      allLists.map(function(item,index){
        if(item.id == id){
          allLists.splice(index,1)
        }
      })
      let len = filters['active'](allLists).length
      this.setData({
        leftItem: len
      })
    }else{      
      list.value = val;
      list.dbtap = false;
      lists[index] = list     
    }
    this.setData({
      lists: lists
    })
  }

})
