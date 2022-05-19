import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../service/api-player'
import { parseLyric } from '../util/parse-lyric'
const audioContext = wx.getBackgroundAudioManager()
const playerStore = new HYEventStore({
  state: {
    currentSong: {},
    durationTime: 0,  // 歌曲的相关信息
    lyricList: [],
    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: '',
    playModeIndex: 0, // 0: 循环播放 1: 单曲循环 2: 随机播放
    isPlaying: false,
    isStoping:false,
    id: '',
    playListSong: [],
    playListIndex: 0,
  },
  actions: {
    playMusicWithSongIdAciton(ctx, { id, isRefresh = false }) {
      // 当播放同一首歌时,不用再次发送网络请求
      if (ctx.id == id && !isRefresh) {
        this.dispatch('changePlayStatusAction')
        return
      }
      ctx.id = id
      // 修改播放状态
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricList = []
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ''
      getSongDetail(id).then(res => {
        ctx.id = id
        ctx.currentSong = res.songs[0];
        ctx.durationTime = res.songs[0].dt;
        audioContext.title = res.songs[0].name
      })
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        // 将拿到的歌词解析成歌词和时间两部分
        const lyrics = parseLyric(lyricString)
        ctx.lyricList = lyrics
      })
      // 因为使用的全局对象,所以先stop掉
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`

      // 设置自动播放
      audioContext.autoplay = true

      // 3.监听audioContext一些事件
      this.dispatch('setupAudioContextListenerAction')

    },
    setupAudioContextListenerAction(ctx) {
      audioContext.onCanplay(() => {
        // 当进行解码完成后再进行播放
        audioContext.play()
      })
      // 监听时间的改变
      audioContext.onTimeUpdate(() => {
        // 获取当前时间
        const currentTime = audioContext.currentTime * 1000
        ctx.currentTime = currentTime
        // 根据当前时间去查找播放的歌词
        if (!ctx.lyricList.length) return
        let i = 0
        for (; i < ctx.lyricList.length; i++) {
         const lyricInfo = ctx.lyricList[i]
          if (currentTime < lyricInfo.time) {
            break
          }
        }
        // 设置当前歌词的索引和内容
        const currentIndex = i - 1
        const currentLyricInfo = ctx.lyricList[currentIndex]
     
        ctx.currentLyricText = currentLyricInfo.text
        ctx.currentLyricIndex = currentIndex
      })
      // 监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch('changeNewMusicAciton')
      })
      // 监听歌曲暂停
      audioContext.onPause(()=>{
        ctx.isPlaying = false
      })
      // 监听歌曲播放
      audioContext.onPlay(()=>{
        ctx.isPlaying = true
      })
      // 监听歌曲停止
      audioContext.onStop(()=>{
        ctx.isPlaying = false
        ctx.isStoping = true
      })
    },
    changePlayStatusAction(ctx, isPlaying = true) {
      if(ctx.isStoping && ctx.isPlaying){
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = ctx.currentSong.name
        ctx.isStoping = false
      }
      ctx.isPlaying = isPlaying
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },
    changeNewMusicAciton(ctx, isNext = true) {
      let index = ctx.playListIndex
      // playModeIndex: 0, // 0: 循环播放 1: 单曲循环 2: 随机播放
      switch (ctx.playModeIndex) {
        case 0:
          if (isNext) { index = index + 1 }
          else {
            index = index - 1
          }
          if (index === ctx.playListSong.length) index = 0
          if (index === -1) index = ctx.playListSong.length - 1
          break
        case 1:
          index = ctx.playListIndex
          break
        case 2:
          index = Math.floor(Math.random() * ctx.playListSong.length)
          break
      }
      console.log(index);

      // 设置index的值
      ctx.playListIndex = index

      // 根据index 获取当前要播放的歌曲
      const currentSong = ctx.playListSong[index]
      // console.log(currentSong);
      // 播放指定的歌曲
      this.dispatch('playMusicWithSongIdAciton', { id: currentSong.id, isRefresh: true })
    }
  }
})

export {
  audioContext,
  playerStore
}