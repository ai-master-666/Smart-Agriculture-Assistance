/**
 * 认证相关 API
 */
import { httpPost } from '@/utils/request'

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  password: string
  phone?: string
  email?: string
}

/**
 * 用户登录
 */
export function login(data: LoginParams) {
  return httpPost<{ access_token: string; user_info: any }>('/auth/login', data, false)
}

/**
 * 用户注册
 */
export function register(data: RegisterParams) {
  return httpPost('/auth/register', data, false)
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser() {
  return httpPost<any>('/auth/me')
}
