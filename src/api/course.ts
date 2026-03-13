/**
 * 农技课堂相关 API
 */
import { httpGet, httpPost, httpPut } from '@/utils/request'

export interface Course {
  id: number
  title: string
  cover: string
  price: number
  original_price?: number
  description: string
  category: 'planting' | 'breeding' | 'machinery' | 'management'
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  student_count: number
  rating: number
  instructor: string
  instructor_avatar: string
  created_at: string
}

export interface CourseChapter {
  id: number
  course_id: number
  title: string
  order: number
  lessons: Array<{
    id: number
    title: string
    video_url: string
    duration: number
    order: number
  }>
}

export interface LearningRecord {
  id: number
  course_id: number
  course_title: string
  course_cover: string
  progress: number
  last_learned: string
  completed: boolean
  created_at: string
}

export interface TestQuestion {
  id: number
  course_id: number
  question: string
  type: 'single' | 'multiple' | 'judgment'
  options: string[]
  correct_answer: string[]
}

export interface TestResult {
  id: number
  course_id: number
  score: number
  passed: boolean
  answers: Array<{
    question_id: number
    selected: string[]
    correct: boolean
  }>
  created_at: string
}

export interface QARecord {
  id: number
  course_id: number
  question: string
  answer?: string
  status: 'pending' | 'answered'
  created_at: string
  answered_at?: string
}

/**
 * 获取课程分类
 */
export function getCourseCategories() {
  return httpGet<Array<{
    id: string
    name: string
    icon: string
  }>>('/courses/categories')
}

/**
 * 获取课程列表
 */
export function getCourses(params?: {
  category?: 'planting' | 'breeding' | 'machinery' | 'management'
  level?: 'beginner' | 'intermediate' | 'advanced'
  price?: 'free' | 'paid'
  sort?: 'hot' | 'new' | 'price_asc' | 'price_desc'
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: Course[], total: number }>('/courses', params)
}

/**
 * 获取课程列表（兼容旧接口）
 */
export function getCourseList(params?: any) {
  return getCourses(params)
}

/**
 * 获取课程详情
 */
export function getCourseDetail(courseId: number) {
  return httpGet<Course>(`/courses/${courseId}`)
}

/**
 * 获取课程章节
 */
export function getCourseChapters(courseId: number) {
  return httpGet<CourseChapter[]>(`/courses/${courseId}/chapters`)
}

/**
 * 获取学习记录
 */
export function getLearningRecords(params?: {
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: LearningRecord[], total: number }>('/courses/learning-records', params)
}

/**
 * 更新学习进度
 */
export function updateLearningProgress(data: {
  course_id: number
  lesson_id: number
  progress: number
}) {
  return httpPost('/courses/learning-progress', data)
}

/**
 * 获取课后测试
 */
export function getCourseTest(courseId: number) {
  return httpGet<TestQuestion[]>(`/courses/${courseId}/test`)
}

/**
 * 提交测试答案
 */
export function submitTestAnswers(data: {
  course_id: number
  answers: Array<{
    question_id: number
    selected: string[]
  }>
}) {
  return httpPost<TestResult>('/courses/test/submit', data)
}

/**
 * 获取测试结果
 */
export function getTestResult(courseId: number) {
  return httpGet<TestResult>(`/courses/${courseId}/test/result`)
}

/**
 * 提交问答
 */
export function submitQuestion(data: {
  course_id: number
  question: string
  contact?: string
}) {
  return httpPost<QARecord>('/courses/questions', data)
}

/**
 * 获取问答列表
 */
export function getQuestions(params?: {
  course_id?: number
  status?: 'pending' | 'answered'
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: QARecord[], total: number }>('/courses/questions', params)
}

/**
 * 获取问答详情
 */
export function getQuestionDetail(questionId: number) {
  return httpGet<QARecord>(`/courses/questions/${questionId}`)
}
