/**
 * 村庄相关 API
 */
import { httpGet } from '@/utils/request'

export interface Village {
  id: number
  name: string
  description: string
  image: string
  location: {
    latitude: number
    longitude: number
  }
  distance: number
  tags: string[]
  featured: boolean
  created_at: string
}

/**
 * 获取附近村庄列表
 */
export function getNearbyVillages(params: {
  latitude: number
  longitude: number
  radius?: number
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: Village[], total: number }>('/villages/nearby', params)
}

/**
 * 获取推荐村庄列表
 */
export function getRecommendedVillages(params?: {
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: Village[], total: number }>('/villages/recommended', params)
}

/**
 * 获取村庄详情
 */
export function getVillageDetail(villageId: number) {
  return httpGet<Village>(`/villages/${villageId}`)
}

/**
 * 搜索村庄
 */
export function searchVillages(params: {
  keyword: string
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: Village[], total: number }>('/villages/search', params)
}
