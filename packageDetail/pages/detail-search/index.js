// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest, getSearchSongs } from '../../../service/api-search'
import debounce from '../../../util/debounce'
const debounceGetSearchSuggest = debounce(getSearchSuggest, 500)
import stringToNodes from '../../../util/string2nodes'
import {playerStore} from '../../../store/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotKeywords: [],
    suggestKeywords: [],
    searchValue: '',
    suggestSongsNodes: [],
    songList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData()
  },
  getPageData: function () {
    // 获取热门搜索列表
    getSearchHot().then(res => {
      this.setData({
        hotKeywords: res.result.hots
      })
    })

  },
  // 事件处理
  handleSearchChange(event) {
    // 1.获取输入的关键字
    const searchValue = event.detail
    // 2.保存关键字
    this.setData({
      searchValue
    })
    // 3.判断关键字为空字符的处理逻辑
    if (!searchValue.length) {
      this.setData({ suggestKeywords: [] })
      this.setData({ songList: [] })
      // 问题1:进行防抖操作后,操作过快小于300ms之后,导致虽然searchValue中没有值的情况下,依旧发送了网络请求,那么suggestKeywords就会有值,这种情况下只需要将网络请求给cancel掉即可(现实很骨感,并没有用).
      debounceGetSearchSuggest.cancel()
      return
    }

    // 4.根据关键字进行搜索
    debounceGetSearchSuggest(searchValue).then(res => {
      if (res.result.allMatch) {
        this.setData({
          suggestKeywords: res.result.allMatch
        })
      }
      // 进行关键字匹配
      if (this.data.suggestKeywords.length) {
        const keywordList = this.data.suggestKeywords.map(item => item.keyword)
        const suggestSongsNodes = []
        for (const keyword of keywordList) {
          const nodes = stringToNodes(keyword, searchValue)
          suggestSongsNodes.push(nodes)

        }
        this.setData({ suggestSongsNodes })
      }
    })
  },
  // 搜索事件的处理
  handleSearchAction() {
    const searchValue = this.data.searchValue
    getSearchSongs(searchValue).then(res => {
      if (res.result) {
        this.setData({ songList: res.result.songs })
      }
    })
  },
  handleSuggetItemClick(event) {
    // 获取searchValue的值
    const searchValue = event.currentTarget.dataset.item
    // 将searchValue的值保存以便绑定到search组件中
    this.setData({ searchValue })
    // 发送网络请求
    getSearchSongs(searchValue).then(res => {
      if (res.result) {
        this.setData({ songList: res.result.songs })
      }
    })
    // 将suggestKeywords清空
    this.setData({ suggestKeywords: [] })
  },

  // 添加到播放列表
  handleSongItemClick(event){
    const index = event.currentTarget.dataset.index
    playerStore.setState('playListSong', this.data.songList)
    playerStore.setState('playListIndex', index)
  }

})