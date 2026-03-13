/**
 * 用户相关 API
 */
import { httpGet, httpPost, httpPut } from '@/utils/request'

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  phone: string
  email: string
  role: string
  created_at: string
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return httpGet<UserInfo>('/user/info')
}

/**
 * 更新用户信息
 */
export function updateUserInfo(data: {
  nickname?: string
  avatar?: string
  email?: string
}) {
  return httpPut('/user/info', data)
}

/**
 * 修改密码
 */
export function changePassword(data: {
  old_password: string
  new_password: string
  confirm_password: string
}) {
  return httpPost('/user/change-password', data)
}

/**
 * 绑定手机
 */
export function bindPhone(data: {
  phone: string
  code: string
}) {
  return httpPost('/user/bind-phone', data)
}

/**
 * 发送验证码
 */
export function sendVerifyCode(data: {
  phone: string
  type: 'bind' | 'reset'
}) {
  return httpPost('/user/send-code', data)
}

/**
 * 重置密码
 */
export function resetPassword(data: {
  phone: string
  code: string
  new_password: string
  confirm_password: string
}) {
  return httpPost('/user/reset-password', data)
}
