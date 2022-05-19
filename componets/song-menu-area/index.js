// componets/song-menu-area/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hotSongs:{
      type:Array,
      value:[]
    },
    title:{
      type:String,
      value:"默认标题"
    }
  },
  methods:{
    handleSongItemClick:function(event){
      const id = event.currentTarget.dataset.id
      wx.navigateTo({
        url: `/packageDetail/pages/detail-songs/index?id=${id}&&type=id`,
      })
    },
  }

  
})
