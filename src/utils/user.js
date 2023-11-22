import axios from 'axios'
// import { ElNotification } from 'element-plus'

//url 前缀
const baseUrl = `https://api.shop.eduwork.cn`

//用户请求
//用户登录
export const loginApi = ({ email, pwd }) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/api/admin/user`,
    headers: { "Authorization": `Bearer ${localStorage.getItem("user_token")}` },
    params: {
      email: email,
      password: pwd
    }
  })
}

export const refreshLoginApi = () => {
  return axios({
    method: 'get',
    url: `${baseUrl}/api/admin/user`,
    headers: { "Authorization": `Bearer ${localStorage.getItem("user_token")}` },
  })
}


export const logOutApi = () => {
  return axios({
    method: 'post',
    url: `${baseUrl}api/auth/logout`,
    headers: { "Authorization": `Bearer ${localStorage.getItem("user_token")}` },
  })
}


