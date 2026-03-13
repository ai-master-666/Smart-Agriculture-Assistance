/**
 * AI村庄助手相关 API
 */
import { httpGet, httpPost } from '@/utils/request'

export interface AIChatMessage {
  id: number
  content: string
  type: 'user' | 'ai'
  created_at: string
}

/**
 * 聊天消息类型定义（兼容旧接口）
 */
export type ChatMessage = AIChatMessage

export interface VillageEncyclopedia {
  id: number
  title: string
  content: string
  category: 'history' | 'culture' | 'industry' | 'customs'
  images?: string[]
  created_at: string
}

export interface ScenicSpot {
  id: number
  name: string
  description: string
  image: string
  address: string
  rating: number
  tags: string[]
  duration: number
}

export interface RecommendedRoute {
  id: number
  title: string
  description: string
  spots: ScenicSpot[]
  total_duration: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface ProductConsultation {
  id: number
  product_id: number
  product_name: string
  product_image: string
  planting_advice: string[]
  market_analysis: string[]
  sales_advice: string[]
  created_at: string
}

export interface TravelGuide {
  id: number
  title: string
  description: string
  day_plans: Array<{
    day: number
    spots: ScenicSpot[]
    activities: string[]
    accommodation: string
  }>
  total_duration: number
  budget: number
  created_at: string
}

export interface DiagnoseResult {
  id: number
  disease: string
  confidence: number
  description: string
  treatment: string[]
  image_url: string
  created_at: string
}

/**
 * 智能问答
 */
export function askAIQuestion(data: {
  question: string
  type?: 'text' | 'voice'
  voice_url?: string
}) {
  return httpPost<{ answer: string }>('/ai/chat', data)
}

/**
 * 智能问答（兼容旧接口）
 */
export function chatWithAI(data: {
  question: string
  type?: 'text' | 'voice'
  voice_url?: string
}) {
  return askAIQuestion(data)
}

/**
 * 获取聊天历史
 */
export function getChatHistory(params?: {
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: AIChatMessage[], total: number }>('/ai/chat/history', params)
}

/**
 * 获取村庄百科
 */
export function getVillageEncyclopedia(params?: {
  category?: 'history' | 'culture' | 'industry' | 'customs'
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: VillageEncyclopedia[], total: number }>('/ai/encyclopedia', params)
}

/**
 * 获取百科详情
 */
export function getEncyclopediaDetail(id: number) {
  return httpGet<VillageEncyclopedia>(`/ai/encyclopedia/${id}`)
}

/**
 * 景点推荐
 */
export function getScenicRecommendations(data: {
  duration: number
  preferences: string[]
  date?: string
  people_count?: number
}) {
  return httpPost<RecommendedRoute[]>('/ai/recommend/scenic', data)
}

/**
 * 农产品咨询
 */
export function consultProduct(data: {
  product_id?: number
  product_name?: string
  question?: string
}) {
  return httpPost<ProductConsultation>('/ai/consult/product', data)
}

/**
 * 生成旅游攻略
 */
export function generateTravelGuide(data: {
  duration: number
  preferences: string[]
  date?: string
  people_count?: number
  budget?: number
}) {
  return httpPost<TravelGuide>('/ai/generate/guide', data)
}

/**
 * 智能客服
 */
export function askCustomerService(data: {
  question: string
  type?: 'order' | 'booking' | 'navigation' | 'other'
}) {
  return httpPost<{ answer: string }>('/ai/service', data)
}

/**
 * 作物诊断
 */
export function diagnoseCrop(data: {
  image: string
  crop_type?: string
}) {
  return httpPost<DiagnoseResult>('/ai/diagnose', data)
}
