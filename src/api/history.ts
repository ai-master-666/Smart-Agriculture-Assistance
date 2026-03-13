/**
 * 浏览历史相关 API
 */
import { httpGet, httpPost, httpDelete } from '@/utils/request'

export interface HistoryItem {
  id: number
  type: 'product' | 'course' | 'tour'
  item_id: number
  item_name: string
  item_image: string
  viewed_at: string
}

/**
 * 获取浏览历史
 */
export function getHistory(params?: {
  type?: 'product' | 'course' | 'tour'
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: HistoryItem[], total: number }>('/history', params)
}

/**
 * 添加浏览历史
 */
export function addHistory(data: {
  type: 'product' | 'course' | 'tour'
  item_id: number
  item_name: string
  item_image: string
}) {
  return httpPost('/history', data)
}

/**
 * 清除浏览历史
 */
export function clearHistory(type?: 'product' | 'course' | 'tour') {
  return httpDelete('/history' + (type ? `?type=${type}` : ''))
}

/**
 * 删除单个浏览历史
 */
export function removeHistory(historyId: number) {
  return httpDelete(`/history/${historyId}`)
}
