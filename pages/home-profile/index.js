// pages/home-profile/index.js
import {getUserInfo} from "../../service/api-login"
Page({
 async handleGetUser(){
   const result = await getUserInfo()
   console.log(result);
  },
  getPhoneNumber(e){
  }
})