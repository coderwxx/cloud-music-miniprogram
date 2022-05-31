import { HYEventStore } from 'hy-event-store'
import { getRanking } from '../service/api-music'
const rankingIds = [3779629,3778678,2884035,19723756]
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
      
      for (const id of rankingIds) {
        
        getRanking(id).then(res => {
          switch (id) {
            case 3778678:
              ctx.hotRanking = res.playlist
              break;
            case 3779629:
              ctx.newSongRanking = res.playlist
              break
            case 2884035:
              ctx.originRanking = res.playlist
              break
            case 19723756:
              ctx.upRanking = res.playlist
          }

        })
      }
    }
  }
})
export { rankingStore }