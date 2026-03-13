/**
 * 搜索相关 API
 */
import { httpGet } from '@/utils/request'

export interface SearchResult {
  products: Array<{
    id: number
    name: string
    image: string
    price: number
    sales: number
  }>
  liveStreams: Array<{
    id: number
    title: string
    cover: string
    viewer_count: number
    status: 'live' | 'upcoming' | 'ended'
  }>
  courses: Array<{
    id: number
    title: string
    cover: string
    price: number
    student_count: number
  }>
  tours: Array<{
    id: number
    name: string
    image: string
    address: string
    rating: number
  }>
}

/**
 * 全局搜索
 */
export function search(params: {
  keyword: string
  type?: 'product' | 'live' | 'course' | 'tour'
  page?: number
  page_size?: number
}) {
  return httpGet<SearchResult>('/search', params)
}

/**
 * 获取搜索历史
 */
export function getSearchHistory() {
  return httpGet<string[]>('/search/history')
}

/**
 * 清除搜索历史
 */
export function clearSearchHistory() {
  return httpGet('/search/history/clear')
}

/**
 * 获取热门搜索
 */
export function getHotSearch() {
  return httpGet<Array<{
    keyword: string
    count: number
  }>>('/search/hot')
}
