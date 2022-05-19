import { LoginRequst } from './index'
export function getLoginCode() {
  return new Promise((reslove, reject) => {
    wx.login({
      timeout: 1000,
      success: res => {
        reslove(res.code)
      },
      fail: error => {
        reject(error)
      }
    })
  })
}

export function codeToToken(code) {
  return LoginRequst.post("/login", { code })
}

export function checkToken() {
  return LoginRequst.post("/auth", {}, {}, true
  )
}

export function checkSession() {

  return new Promise(reslove => {
    wx.checkSession({
      success: () => {
        reslove(true)
      },
      fail: () => {
        reslove(false)
      }
    })
  })
}

export function getUserInfo(){
  return new Promise((reslove,reject)=>{
    wx.getUserProfile({
      desc: 'desc',
      success:res=>{
        reslove(res)
      },
      fail:error=>{
        reject(error)
      }
    })
  })

}