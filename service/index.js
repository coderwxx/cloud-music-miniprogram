const BASE_URL = "https://coderwhy-music.vercel.app/"
const LOGIN_BASE_URL = "https://coderwhy-music.vercel.app/"
const token = wx.getStorageSync('token')
class HYRequest {
  constructor(baseURL, authHeader = {}) {
    this.baseURL = baseURL
    this.authHeader = authHeader
  }
  request(url, method, params, header = {}, isAuth = false) {
    const finalHeader = isAuth ? { ...this.authHeader, ...header } : header
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + url,
        method,
        header: finalHeader,
        data: params,
        success(res) {
          resolve(res.data)
        },
        fail(error) {
          reject(error)
        }
      })
    })
  }
  get(url, params, header, isAuth) {
    return this.request(url, "GET", params, header, isAuth)
  }
  post(url, data, header, isAuth) {
    return this.request(url, "POST", data, header, isAuth)
  }
}
const HyRequest = new HYRequest(BASE_URL)
const LoginRequst = new HYRequest(LOGIN_BASE_URL, {token})
export default HyRequest
export {
  LoginRequst
}