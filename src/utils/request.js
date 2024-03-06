// ajax
import axios from 'axios'; 
// 基地址
axios.defaults.baseURL ='后端基地址'
// 设置请求拦截器
axios.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
  );



  export default axios
  