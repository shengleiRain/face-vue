import axios from 'axios'

const service = axios.create({
  baseURL: 'dev', //请求地址前缀
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    //添加请求头部参数
    // config.headers['Access-Control-Allow-Origin'] = '*'
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    //拦截到成功的数据
    return response.data
  },
  (error) => {
    //拦截到失败的数据
    return Promise.reject(error)
  }
)

export default service
