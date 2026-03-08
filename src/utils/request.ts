/**
 * 统一请求封装
 */
import { storage } from './storage'

const BASE_URL = 'http://127.0.0.1:8000/api/v1'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: any
  needAuth?: boolean
}

export function request<T = any>(options: RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const token = storage.get('access_token')
    
    uni.request({
      url: `${BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...(token && options.needAuth !== false ? { Authorization: `Bearer ${token}` } : {}),
        ...options.header
      },
      success: (res) => {
        const { statusCode, data } = res as any
        
        if (statusCode === 200) {
          resolve(data as T)
        } else if (statusCode === 401) {
          // Token 过期，跳转登录
          // storage.remove('access_token')
          // storage.remove('user_info')
          
          // 如果不需要认证，则不跳转
          if (options.needAuth === false) {
             resolve({} as T) // 返回空对象避免报错
             return
          }

          // 避免无限跳转
          const pages = getCurrentPages()
          const currentPage = pages[pages.length - 1]
          if (currentPage && currentPage.route !== 'pages/user/login') {
              uni.navigateTo({ url: '/pages/user/login' })
          }
          reject(new Error('未登录'))
        } else {
          uni.showToast({ title: data?.message || '请求失败', icon: 'none' })
          reject(data)
        }
      },
      fail: (err) => {
        console.error('Request error:', err)
        uni.showToast({ title: '网络错误', icon: 'none' })
        reject(err)
      }
    })
  })
}

// 快捷方法
export const httpGet = <T = any>(url: string, data?: any, needAuth = true) => 
  request<T>({ url, method: 'GET', data, needAuth })

export const httpPost = <T = any>(url: string, data?: any, needAuth = true) => 
  request<T>({ url, method: 'POST', data, needAuth })

export const httpPut = <T = any>(url: string, data?: any, needAuth = true) => 
  request<T>({ url, method: 'PUT', data, needAuth })

export const httpDelete = <T = any>(url: string, data?: any, needAuth = true) => 
  request<T>({ url, method: 'DELETE', data, needAuth })

interface UploadOptions {
  url: string
  filePath: string
  name?: string
  formData?: any
  header?: any
  needAuth?: boolean
}

export function upload<T = any>(options: UploadOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const token = storage.get('access_token')
    
    uni.uploadFile({
      url: `${BASE_URL}${options.url}`,
      filePath: options.filePath,
      name: options.name || 'file',
      formData: options.formData,
      header: {
        ...(token && options.needAuth !== false ? { Authorization: `Bearer ${token}` } : {}),
        ...options.header
      },
      success: (res) => {
        const statusCode = res.statusCode
        let data: any
        try {
          data = JSON.parse(res.data)
        } catch (e) {
          data = res.data
        }
        
        if (statusCode === 200) {
          resolve(data as T)
        } else if (statusCode === 401) {
          // Token 过期，跳转登录
          if (options.needAuth === false) {
             resolve({} as T)
             return
          }

          const pages = getCurrentPages()
          const currentPage = pages[pages.length - 1]
          if (currentPage && currentPage.route !== 'pages/user/login') {
              uni.navigateTo({ url: '/pages/user/login' })
          }
          reject(new Error('未登录'))
        } else {
          uni.showToast({ title: data?.message || '上传失败', icon: 'none' })
          reject(data)
        }
      },
      fail: (err) => {
        console.error('Upload error:', err)
        uni.showToast({ title: '网络错误', icon: 'none' })
        reject(err)
      }
    })
  })
}

export const httpUpload = <T = any>(url: string, filePath: string, name = 'file', formData?: any, needAuth = true) => 
  upload<T>({ url, filePath, name, formData, needAuth })
