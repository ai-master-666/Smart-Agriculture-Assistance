import { httpGet } from '@/utils/request'

export interface LiveRoom {
  id: number
  title: string
  cover_image: string
  status: 'live' | 'pending' | 'ended'
  viewer_count: number
  host_id: number
  started_at?: string
  description?: string
  pull_url?: string
}

export interface LiveProduct {
  id: number
  product_id: number
  product_name: string
  price: number
  cover_image: string
  is_featured: boolean
}

/**
 * 获取直播间列表
 */
export function getLiveList(params?: { page?: number, page_size?: number, status?: string }) {
  return httpGet<LiveRoom[]>('/lives', params, false)
}

/**
 * 获取直播间详情
 */
export function getLiveDetail(roomId: number) {
  return httpGet<LiveRoom>(`/lives/${roomId}`, {}, false)
}

/**
 * 获取直播间商品
 */
export function getLiveProducts(roomId: number) {
  return httpGet<LiveProduct[]>(`/lives/${roomId}/products`, {}, false)
}
