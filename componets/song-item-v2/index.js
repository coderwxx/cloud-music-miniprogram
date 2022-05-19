// componets/song-item-v2/index.js
import { playerStore } from '../../store/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSongItemClick() {
      const id = this.properties.item.id
      wx.navigateTo({
        url: '/packagePlayer/pages/music-player/index?id=' + id,
      })
      playerStore.dispatch('playMusicWithSongIdAciton',{id})
    }
  }
})
