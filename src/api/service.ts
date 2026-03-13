/**
 * 客服中心相关 API
 */
import { httpGet, httpPost } from '@/utils/request'

export interface FAQ {
  id: number
  question: string
  answer: string
  category: string
  created_at: string
}

export interface Feedback {
  id: number
  title: string
  content: string
  status: 'pending' | 'processing' | 'resolved'
  created_at: string
  reply?: string
  replied_at?: string
}

export interface Message {
  id: number
  content: string
  type: 'user' | 'system'
  created_at: string
}

/**
 * 获取常见问题
 */
export function getFAQs(params?: {
  category?: string
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: FAQ[], total: number }>('/service/faqs', params)
}

/**
 * 提交意见反馈
 */
export function submitFeedback(data: {
  title: string
  content: string
  contact?: string
}) {
  return httpPost('/service/feedback', data)
}

/**
 * 获取反馈列表
 */
export function getFeedbackList(params?: {
  status?: 'pending' | 'processing' | 'resolved'
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: Feedback[], total: number }>('/service/feedback', params)
}

/**
 * 获取反馈详情
 */
export function getFeedbackDetail(feedbackId: number) {
  return httpGet<Feedback>(`/service/feedback/${feedbackId}`)
}

/**
 * 发送客服消息
 */
export function sendServiceMessage(content: string) {
  return httpPost<Message>('/service/messages', { content })
}

/**
 * 获取客服消息历史
 */
export function getServiceMessages(params?: {
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: Message[], total: number }>('/service/messages', params)
}
