export function queryRect(selector) {
  return new Promise(reslove => {
    const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect()
    query.exec((res) => {
      reslove(res)
    })
  })
}