// pages/home-video/index.js
import { getTopMV } from '../../service/api-video'
Page({

  data: {
    topMVs: [],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function () {
    this.getTopMVData(0)
  },

  getTopMVData: async function (offset) {
    // 判断是否可以请求
    if (!this.data.hasMore) return
    // 展示加载动画
    wx.showNavigationBarLoading()
     // 真正请求数据
    const res = await getTopMV(offset)
    let newData = this.data.topMVs
    if (offset === 0) {
      newData = res.data
    } else {
      newData = newData.concat(res.data)
    }
    // 设置数据
    this.setData({
      topMVs: newData
    })
    this.setData({
      hasMore: res.hasMore
    })
    wx.hideNavigationBarLoading()
    if (offset === 0) {
      wx.stopPullDownRefresh()
    }
  },
    // 封装事件处理的方法
  handleVideoItemClick:function(event){
    // 获取id
    const id = event.currentTarget.dataset.item.id
     // 页面跳转
    wx.navigateTo({
      url: '/pages/detail-video/index?id='+id,
    })
  },

  // 下拉刷新
  onPullDownRefresh: async function () {
    this.getTopMVData(0)
  },
  // 到达底部
  onReachBottom: async function () {
    this.getTopMVData(this.data.topMVs.length)
  }
})