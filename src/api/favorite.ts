/**
 * 收藏相关 API
 */
import { httpGet, httpPost, httpDelete } from '@/utils/request'

export interface FavoriteItem {
  id: number
  type: 'product' | 'course' | 'tour'
  item_id: number
  item_name: string
  item_image: string
  created_at: string
}

/**
 * 获取收藏列表
 */
export function getFavorites(params?: {
  type?: 'product' | 'course' | 'tour'
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: FavoriteItem[], total: number }>('/favorites', params)
}

/**
 * 添加收藏
 */
export function addFavorite(data: {
  type: 'product' | 'course' | 'tour'
  item_id: number
}) {
  return httpPost('/favorites', data)
}

/**
 * 取消收藏
 */
export function removeFavorite(favoriteId: number) {
  return httpDelete(`/favorites/${favoriteId}`)
}

/**
 * 检查是否已收藏
 */
export function checkFavorite(type: 'product' | 'course' | 'tour', itemId: number) {
  return httpGet<{ is_favorite: boolean }>(`/favorites/check?type=${type}&item_id=${itemId}`)
}
