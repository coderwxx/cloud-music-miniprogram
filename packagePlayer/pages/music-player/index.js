// pages/music-player/index.js
import { audioContext } from '../../../store/index'
import { playerStore } from '../../../store/index'
const playModeNames = ['order', 'repeat', 'random']
Page({

  data: {
    currentSong: {},
    durationTime: 0,  // 歌曲的相关信息
    lyricList: [],

    currentPage: 0,
    swiperHight: 0,
    isShowLyric: false,

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: '',

    isPlaying:false,

    sliderValue: 0,
    screenHeight: 0,
    screenTop: 0,
    playModeNames: "order"
  },

  onLoad: function (options) {
    this.setupPlayStoreListener()
    // 3.动态计算内容高度
    const globalData = getApp().globalData
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const screenHeight = globalData.screenHeight
    this.setData({ screenHeight })
    const screenWidth = globalData.screenWidth
    const screenRadio = screenHeight / screenWidth
    const isShowLyric = screenRadio > 2 ? true : false
    this.setData({
      isShowLyric
    })

    const swiperHight = screenHeight - navBarHeight - statusBarHeight
    this.setData({
      swiperHight
    })

  },



  // 事件监听
  handleswiperItemChange: function (event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  },
  handleSliderChange: function (event) {
    const currentValue = event.detail.value
    // 获取当前播放时间
    const currentTime = currentValue * this.data.durationTime / 100
    // 先暂停播放
    // audioContext.pause()
    audioContext.seek(currentTime / 1000)
    this.setData({ sliderValue: currentValue })

  },
  handleSliderChanging: function (event) {
    const currentValue = event.detail.value
    // 获取当前播放时间
    const currentTime = currentValue * this.data.durationTime / 100
    // 设置当前时间
    this.setData({ currentTime })
    // 当滑块处于变动状态时,暂停播放
    audioContext.pause()
  },
  handleBackBtnClick: function () {
    wx.navigateBack()
  },
  handlePlayModeChange: function () {
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) playModeIndex = 0
    playerStore.setState('playModeIndex', playModeIndex)
  },
  handlePlayStatusChange: function () {
    playerStore.dispatch('changePlayStatusAction',!this.data.isPlaying)

  },

  //======================= 数据监听 ============================
  setupPlayStoreListener() {
    // 监听"currentSong", "durationTime", "lyricList"数据的改变
    playerStore.onStates(["currentSong", "durationTime", "lyricList"], ({ currentSong, durationTime, lyricList }) => {
      if (currentSong) this.setData({ currentSong })
      if (durationTime) this.setData({ durationTime })
      if (lyricList) this.setData({ lyricList })
    })
    // 监听currentTime,currentLyricIndex,currentLyricText数据的改变
    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({ currentTime, currentLyricIndex, currentLyricText }) => {
      const sliderValue = currentTime / this.data.durationTime * 100
      if (currentTime) this.setData({ currentTime, sliderValue })
      if (currentLyricIndex) this.setData({ currentLyricIndex, screenTop: currentLyricIndex * 35 })
      if (currentLyricText) this.setData({ currentLyricText })
    })
    playerStore.onStates(["playModeIndex", "isPlaying"], ({ playModeIndex, isPlaying }) => {
      if (playModeIndex !== undefined) {
        this.setData({
          playModeIndex,
          playModeNames: playModeNames[playModeIndex],
        })
      }
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying
        })
      }
    })

  },
  handlePrevBtnClick() {
    playerStore.dispatch('changeNewMusicAciton', false)
  },
  handleNextBtnClick() {
    playerStore.dispatch('changeNewMusicAciton')
  }
})
