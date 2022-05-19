// pages/detail-video/index.js
import { getMVDetail, getMVURL, getRelatedAllVideo } from '../../../service/api-video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvDetail: {},
    mvURL: {},
    relatedAllVideo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.获取传入的id
    const id = options.id
    // 2.获取页面数据
    this.getPageData(id)

  },

  getPageData:function(id) {
    // 1.请求播放地址

    getMVURL(id).then(res => {
      this.setData({
        mvURL: res.data
      })
    })
    // 2.请求视频信息
    getMVDetail(id).then(res => {
      this.setData({ mvDetail: res.data })
    })
    // 3.请求相关视频
    getRelatedAllVideo(id).then(res => {
      this.setData({
        relatedAllVideo: res.data
      })
    })
  }
    


})