/**
 * 地址管理相关 API
 */
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/request'

export interface Address {
  id: number
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  is_default: boolean
  created_at: string
}

/**
 * 获取地址列表
 */
export function getAddressList() {
  return httpGet<Address[]>('/addresses')
}

/**
 * 获取默认地址
 */
export function getDefaultAddress() {
  return httpGet<Address>('/addresses/default')
}

/**
 * 添加地址
 */
export function addAddress(data: {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  is_default?: boolean
}) {
  return httpPost('/addresses', data)
}

/**
 * 更新地址
 */
export function updateAddress(id: number, data: {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  is_default?: boolean
}) {
  return httpPut(`/addresses/${id}`, data)
}

/**
 * 删除地址
 */
export function deleteAddress(id: number) {
  return httpDelete(`/addresses/${id}`)
}

/**
 * 设置默认地址
 */
export function setDefaultAddress(id: number) {
  return httpPost(`/addresses/${id}/default`)
}
