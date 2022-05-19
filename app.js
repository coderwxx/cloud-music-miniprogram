// app.js
import { getLoginCode, codeToToken, checkToken, checkSession } from './service/api-login'
App({
  globalData: {
    statusBarHeight: 0,
    screenHeight: 0,
    navBarHeight: 44,
    screenWidth: 0
  },
  async onLaunch() {
    // 获取设备信息
    const info = wx.getSystemInfoSync()
    this.globalData.statusBarHeight = info.statusBarHeight
    this.globalData.screenHeight = info.screenHeight
    this.globalData.screenWidth = info.screenWidth

    this.handleLogin()
  },

  async handleLogin(){
  // 让用户进行默认登录
  const token = wx.getStorageSync('token')
  // 检查token是否过期
  const checkResult = await checkToken()
  // 检查session是否过期
  const isSessionExpire = await checkSession()

  if(!token || checkResult.errorCode || !isSessionExpire){
    this.loginAciton()
  }
  },
  async loginAciton() {
    // 获取code信息
    const code = await getLoginCode()
    // 根据code给服务器端发送网络请求,获取token
    const result = await codeToToken(code)
    const token = result.token
    // 进行存储
    wx.setStorageSync('token', token)
  }




}
)