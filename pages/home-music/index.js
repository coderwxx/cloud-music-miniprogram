// pages/home-music/index.js
import { getBanners, getHotSong } from '../../service/api-music'
import { queryRect } from '../../util/query-rect'
import throttle from '../../util/throttle'
import { rankingStore, playerStore } from '../../store/index'
const hrottleQueryRect = throttle(queryRect, 1000, { trailing: true })
const rankingMap = { 0: 'newSongRanking', 2: 'originRanking', 3: 'upRanking' }
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    swiperHight: 0,
    recommendSongs: [],
    hotSongsMenu: [],
    recommendSongsMenu: [],
    rankingData: { 0: {}, 2: {}, 3: {} },
    currentSong: {},
    isPlaying: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.请求页面数据
    this.getPageData()

    // 2.请求公共数据
    rankingStore.dispatch('getRankingDataAction')


    // 从store获取共享的数据
    this.setupPlayerStoreListener()

  },
  // 对请求的数据进行处理
  getRankingHandler: function (idx) {
    return res => {
      if (Object.keys(res).length === 0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = { name, coverImgUrl, playCount, songList }
      const newData = { ...this.data.rankingData, [idx]: rankingObj }
      this.setData({
        rankingData: newData
      })
    }
  },
  // 点击更多
  handleMoreClick: function () {
    this.naviagtionToDetailSongs('hotRanking')
  },
  // 点击巅峰榜单数据
  handleRankingItemClick: function (event) {
    const id = event.currentTarget.dataset.id
    console.log(id);
    const ranking = rankingMap[id]
    this.naviagtionToDetailSongs(ranking)
  },

  naviagtionToDetailSongs: function (rankingName) {
    wx.navigateTo({
      url: `/packageDetail/pages/detail-songs/index?ranking=${rankingName}&&type=ranking`,
    })
  },



  getPageData: function () {
    getBanners().then(res => {
      this.setData({
        banners: res.banners
      })
    })
    getHotSong().then(res => {
      this.setData({
        hotSongsMenu: res.playlists
      })

    })
    getHotSong('流行').then(res => {
      this.setData({
        recommendSongsMenu: res.playlists
      })
    })
  },
  handleSearchClick: function () {
    wx.navigateTo({
      url: '/packageDetail/pages/detail-search/index',
    })
  },
  handleSwiperImageLoaded: function () {
    hrottleQueryRect('.swiper-image').then(res => {
      this.setData({
        swiperHight: res[0].height
      })
    })
  },
  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState('playListSong', this.data.recommendSongs)
    playerStore.setState('playListIndex', index)
  },
  setupPlayerStoreListener() {
    // 1.排行榜监听
    rankingStore.onState('hotRanking', res => {
      if (!res.tracks) return
      const recommendSongs = res.tracks.slice(0, 6)
      this.setData({
        recommendSongs
      })
    })
    rankingStore.onState('newSongRanking', this.getRankingHandler(0))
    rankingStore.onState('originRanking', this.getRankingHandler(2))
    rankingStore.onState('upRanking', this.getRankingHandler(3))
    // 播放器的监听
    playerStore.onStates(['currentSong', 'isPlaying'], ({ currentSong, isPlaying }) => {
      if (currentSong) this.setData({
        currentSong
      })
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying
        })
      }

    })
  },
  changePlayStatusClick() {
    playerStore.dispatch('changePlayStatusAction', !this.data.isPlaying)
  },

  handlePlaybarClick(){
    wx.navigateTo({
      url: '/packagePlayer/pages/music-player/index?id='+this.data.currentSong.id,
    })
  }
})