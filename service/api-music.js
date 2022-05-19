import hyRequest from './index'

export function getBanners() {
  return hyRequest.get("/banner", {
    type: 2
  })
}

export function getRanking(idx){
  return hyRequest.get('/top/list',{
    idx
  })
}

export function getHotSong(cat="全部",limit=6,offset=0){
  return hyRequest.get('/top/playlist',{
    cat,
    limit,
    offset
  })
}

export function getSongDetail(id){
  return hyRequest.get('/playlist/detail/dynamic',{
    id
  })
}
