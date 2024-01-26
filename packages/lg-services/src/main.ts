import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';

export default class HttpRequest {
  private instance: AxiosInstance;
  constructor(options: AxiosRequestConfig) {
    this.instance = axios.create(options);

    // 添加请求拦截器
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // 在发送请求之前做些什么
        // 可以添加全局的请求头、请求参数等处理
        console.log('请求拦截进来了-----');
        return config;
      },
      (error: any) => {
        // 对请求错误做些什么
        return Promise.reject(error);
      }
    );

    // 添加响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 对响应数据做些什么
        // 可以处理全局的响应数据格式、错误处理等
        console.log('响应拦截进来了----------');
        return response;
      },
      (error: any) => {
        // 对响应错误做些什么
        return Promise.reject(error);
      }
    );
  }
}
