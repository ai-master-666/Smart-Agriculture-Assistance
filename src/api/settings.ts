/**
 * 设置相关 API
 */
import { httpGet, httpPut, httpPost } from '@/utils/request'

export interface Settings {
  notification: {
    order: boolean
    marketing: boolean
    system: boolean
  }
  privacy: {
    personal_info: boolean
    location: boolean
    camera: boolean
  }
  appearance: {
    theme: 'light' | 'dark' | 'auto'
    language: 'zh-CN' | 'en-US'
  }
}

export interface AppInfo {
  version: string
  name: string
  description: string
  copyright: string
  privacy_policy: string
  user_agreement: string
}

/**
 * 获取用户设置
 */
export function getSettings() {
  return httpGet<Settings>('/settings')
}

/**
 * 更新用户设置
 */
export function updateSettings(data: Partial<Settings>) {
  return httpPut('/settings', data)
}

/**
 * 获取应用信息
 */
export function getAppInfo() {
  return httpGet<AppInfo>('/settings/app')
}

/**
 * 清除缓存
 */
export function clearCache() {
  return httpPost('/settings/clear-cache')
}

/**
 * 检查更新
 */
export function checkUpdate() {
  return httpGet<{
    has_update: boolean
    version: string
    description: string
    download_url: string
  }>('/settings/check-update')
}
