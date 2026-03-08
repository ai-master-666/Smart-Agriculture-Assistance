import { httpGet, httpPost } from '@/utils/request'

export interface Course {
  id: number
  title: string
  cover_image: string
  category: string
  level: string
  price: number
  total_hours: number
  student_count: number
  description?: string
  instructor_id?: number
  chapters?: Chapter[]
}

export interface Chapter {
  id: number
  title: string
  sort_order: number
  lessons: Lesson[]
}

export interface Lesson {
  id: number
  title: string
  duration: number
  is_free: boolean
  video_url?: string
  watched_seconds?: number
  is_completed?: boolean
}

/**
 * 获取课程列表
 */
export function getCourseList(params?: { page?: number, page_size?: number, category?: string, level?: string, keyword?: string }) {
  return httpGet<{ items: Course[], total: number }>('/courses', params, false)
}

/**
 * 获取课程详情
 */
export function getCourseDetail(courseId: number) {
  return httpGet<Course>(`/courses/${courseId}`, {}, false)
}

/**
 * 报名课程
 */
export function enrollCourse(courseId: number) {
  return httpPost(`/courses/${courseId}/enroll`)
}

/**
 * 获取课时详情
 */
export function getLessonDetail(courseId: number, lessonId: number) {
  return httpGet<Lesson>(`/courses/${courseId}/lessons/${lessonId}`)
}
