import axios from 'axios'
// import { ElNotification } from 'element-plus'



const httpInstance = async (axiosObj) => {
  try {
    const res = await axios({
      url: axiosObj.value.url,
      method: axiosObj.value.methods,
      baseURL: 'https://api.shop.eduwork.cn/',
      headers: { 'Authorization': sessionStorage.getItem('token') },
      params: axiosObj.value.params
    })
    return res
  } catch (err) {
    console.log(err)
  }
}




export default httpInstance