// base-ui/nav-bar/index.js
const globalData = getApp().globalData

Component({
  options:{
    multipleSlots:true
  },
  properties: {
    title: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: globalData.statusBarHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleLeftClick: function() {
      console.log("+++++++++");
      this.triggerEvent('click')
    }
  }
})
