/**
 * 轮播Banner相关 API
 */
import { httpGet } from '@/utils/request'

export interface Banner {
  id: number
  title: string
  image: string
  link: string
  type: 'activity' | 'product' | 'live' | 'tour'
  start_time: string
  end_time: string
  sort: number
  status: 'active' | 'inactive'
  created_at: string
}

/**
 * 获取轮播Banner列表
 */
export function getBanners(params?: {
  type?: 'activity' | 'product' | 'live' | 'tour'
  limit?: number
}) {
  return httpGet<Banner[]>('/banners', params)
}
