// pages/detail-songs/index.js
import { rankingStore,playerStore } from '../../../store/index'
import { getSongDetail } from '../../../service/api-music'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankingInfo:{},
    songItemInfo:{},
    rankingName:'',
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 'ranking') {
      const rankingName = options.ranking
      this.setData({
        rankingName,
        type:options.type
      })
      rankingStore.onState(rankingName, res => {
        this.setData({
          rankingInfo:res
        })
      })
    } else if (options.type === 'id') {
      const id = options.id
      getSongDetail(id).then(res=>{
        console.log(res.playlist);
        this.setData({
          songItemInfo:res.playlist,
          type:options.type
        })
      })
    }
  },
  handleRankingItemClick:function(event){
    const index = event.currentTarget.dataset.index
    playerStore.setState('playListSong',this.data.rankingInfo.tracks)
    playerStore.setState('playListIndex',index)
  },
  handleSongItemClick:function(event){
    const index = event.currentTarget.dataset.index
    playerStore.setState('playListSong',this.data.songItemInfo.tracks)
    playerStore.setState('playListIndex',index)
  }
})