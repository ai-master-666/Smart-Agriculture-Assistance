import { httpGet } from '@/utils/request'

export interface ScenicSpot {
  id: number
  name: string
  description: string
  cover_image: string
  category: string
  location: string
}

export interface SpotDetail extends ScenicSpot {
  hotspots: Hotspot[]
  scene_config?: any
}

export interface Hotspot {
  id: number
  name: string
  description: string
  position: { x: number, y: number, z: number }
  link_type: string
  link_url?: string
}

/**
 * 获取景点列表
 */
export function getSpotList() {
  return httpGet<ScenicSpot[]>('/tour/spots', {}, false)
}

/**
 * 获取景点详情
 */
export function getSpotDetail(spotId: number) {
  return httpGet<SpotDetail>(`/tour/spots/${spotId}`, {}, false)
}
