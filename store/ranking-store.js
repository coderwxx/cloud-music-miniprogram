import { HYEventStore } from 'hy-event-store'
import { getRanking } from '../service/api-music'
const rankingStore = new HYEventStore({
  state: {
    hotRanking: {},
    newSongRanking: {},
    originRanking: {},
    upRanking: {}
  },
  actions: {
     // 0: 新歌榜 1: 热门榜 2: 原创榜 3: 飙升榜
    getRankingDataAction(ctx) {
      for (let i = 0; i < 4; i++) {
        getRanking(i).then(res => {
          switch (i) {
            case 1:
              ctx.hotRanking = res.playlist
              break;
            case 0:
              ctx.newSongRanking = res.playlist
              break
            case 2:
              ctx.originRanking = res.playlist
              break
            case 3:
              ctx.upRanking = res.playlist
          }

        })
      }
    }
  }
})
export { rankingStore }