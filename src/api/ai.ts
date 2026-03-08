import { httpPost, httpUpload } from '@/utils/request'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  type?: 'text' | 'image' | 'voice'
}

export interface DiagnoseResult {
  disease_name: string
  confidence: number
  description: string
  treatment: string
  preventive_measures: string
}

/**
 * AI 智能问答
 * @param query 用户提问
 * @param history 历史对话上下文
 */
export function chatWithAI(query: string, history: ChatMessage[] = []) {
  // 预留接口：后端对接 DeepSeek/ChatGPT/文心一言 等大模型
  return httpPost<ChatMessage>('/ai/chat', { query, history })
}

/**
 * 图像识别诊断（病虫害/作物健康）
 * @param filePath 图片本地路径
 */
export function diagnoseCrop(filePath: string) {
  // 预留接口：后端对接百度 AI/阿里云 AI 图像识别服务
  return httpUpload<DiagnoseResult>('/ai/diagnose', filePath)
}

/**
 * 获取 AI 知识库推荐
 * @param type 推荐类型：'spot' | 'product' | 'course'
 * @param keywords 关键词
 */
export function getAIRecommendations(type: string, keywords: string) {
  return httpPost<any[]>('/ai/recommend', { type, keywords })
}
