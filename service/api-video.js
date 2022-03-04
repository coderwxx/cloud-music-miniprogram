import HyRequest from './index'
export function getTopMV(offset,limit=10){
  return HyRequest.get('/top/mv',{
    offset,
    limit,
  })
}
export function getMVDetail(mvid){
  return HyRequest.get('/mv/detail',{
    mvid
  })
}
export function getMVURL(id){
  return HyRequest.get('/mv/url',{
    id
  })
}
export function getRelatedAllVideo(id){
  return HyRequest.get('/related/allvideo',{
    id
  })
}