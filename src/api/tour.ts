/**
 * 乡村云游相关 API
 */
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/request'

export interface TouristSpot {
  id: number
  name: string
  description: string
  image: string
  images: string[]
  address: string
  location: {
    latitude: number
    longitude: number
  }
  category: 'natural' | 'cultural' | 'experience'
  rating: number
  review_count: number
  vr_url?: string
  created_at: string
}

export interface ExperienceActivity {
  id: number
  name: string
  description: string
  image: string
  price: number
  duration: number
  available_slots: number
  schedule: string[]
  created_at: string
}

export interface Homestay {
  id: number
  name: string
  description: string
  image: string
  images: string[]
  address: string
  price: number
  room_types: Array<{
    id: number
    name: string
    price: number
    capacity: number
    available: number
  }>
  facilities: string[]
  rating: number
  review_count: number
  created_at: string
}

export interface CheckinRecord {
  id: number
  spot_id: number
  spot_name: string
  image: string
  checkin_time: string
  share_url?: string
  created_at: string
}

/**
 * 获取景点列表
 */
export function getTouristSpots(params?: {
  category?: 'natural' | 'cultural' | 'experience'
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: TouristSpot[], total: number }>('/tour/spots', params)
}

/**
 * 获取景点列表（兼容旧接口）
 */
export function getSpotList(params?: any) {
  return getTouristSpots(params)
}

/**
 * 景点类型定义（兼容旧接口）
 */
export type ScenicSpot = TouristSpot

/**
 * 获取景点详情
 */
export function getTouristSpotDetail(spotId: number) {
  return httpGet<TouristSpot>(`/tour/spots/${spotId}`)
}

/**
 * 获取景点详情（兼容旧接口）
 */
export function getSpotDetail(spotId: number) {
  return getTouristSpotDetail(spotId)
}

/**
 * 景点详情类型定义（兼容旧接口）
 */
export type SpotDetail = TouristSpot

/**
 * 获取VR全景
 */
export function getVRPanorama(spotId: number) {
  return httpGet<{ url: string }>(`/tour/spots/${spotId}/vr`)
}

/**
 * 获取农事体验活动列表
 */
export function getExperienceActivities(params?: {
  spot_id?: number
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: ExperienceActivity[], total: number }>('/tour/experiences', params)
}

/**
 * 预约农事体验
 */
export function bookExperience(data: {
  activity_id: number
  date: string
  time: string
  quantity: number
  contact_name: string
  contact_phone: string
}) {
  return httpPost('/tour/experiences/book', data)
}

/**
 * 获取民宿列表
 */
export function getHomestays(params?: {
  spot_id?: number
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: Homestay[], total: number }>('/tour/homestays', params)
}

/**
 * 获取民宿详情
 */
export function getHomestayDetail(homestayId: number) {
  return httpGet<Homestay>(`/tour/homestays/${homestayId}`)
}

/**
 * 预订民宿
 */
export function bookHomestay(data: {
  homestay_id: number
  room_type_id: number
  checkin_date: string
  checkout_date: string
  guests: number
  contact_name: string
  contact_phone: string
  special_request?: string
}) {
  return httpPost('/tour/homestays/book', data)
}

/**
 * 景点打卡
 */
export function checkinSpot(data: {
  spot_id: number
  latitude: number
  longitude: number
  note?: string
  image?: string
}) {
  return httpPost<{ share_url: string }>('/tour/checkin', data)
}

/**
 * 获取打卡记录
 */
export function getCheckinRecords(params?: {
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: CheckinRecord[], total: number }>('/tour/checkin/records', params)
}
