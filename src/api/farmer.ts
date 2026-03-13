/**
 * 农民认证相关 API
 */
import { httpGet, httpPost, httpPut } from '@/utils/request'

export interface FarmerApplication {
  id: number
  user_id: number
  name: string
  phone: string
  id_card: string
  address: string
  land_area: number
  crops: string[]
  status: 'pending' | 'approved' | 'rejected'
  reason?: string
  created_at: string
  updated_at: string
}

/**
 * 提交农民认证申请
 */
export function submitFarmerApplication(data: {
  name: string
  phone: string
  id_card: string
  address: string
  land_area: number
  crops: string[]
  id_card_front: string
  id_card_back: string
  land_certificate?: string
}) {
  return httpPost('/farmer/apply', data)
}

/**
 * 获取认证申请状态
 */
export function getApplicationStatus() {
  return httpGet<FarmerApplication>('/farmer/application')
}

/**
 * 更新认证申请
 */
export function updateApplication(data: {
  name?: string
  phone?: string
  address?: string
  land_area?: number
  crops?: string[]
  id_card_front?: string
  id_card_back?: string
  land_certificate?: string
}) {
  return httpPut('/farmer/application', data)
}

/**
 * 获取农民信息
 */
export function getFarmerInfo() {
  return httpGet<{
    id: number
    user_id: number
    name: string
    phone: string
    id_card: string
    address: string
    land_area: number
    crops: string[]
    is_certified: boolean
    created_at: string
  }>('/farmer/info')
}

/**
 * 更新农民信息
 */
export function updateFarmerInfo(data: {
  name?: string
  phone?: string
  address?: string
  land_area?: number
  crops?: string[]
}) {
  return httpPut('/farmer/info', data)
}
