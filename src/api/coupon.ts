/**
 * 优惠券相关 API
 */
import { httpGet, httpPost } from '@/utils/request'

export interface Coupon {
  id: number
  code: string
  type: 'fixed' | 'percentage'
  value: number
  min_amount: number
  start_time: string
  end_time: string
  status: 'available' | 'used' | 'expired'
  created_at: string
}

/**
 * 获取优惠券列表
 */
export function getCouponList(params?: {
  status?: 'available' | 'used' | 'expired'
  page?: number
  page_size?: number
}) {
  return httpGet<{ items: Coupon[], total: number }>('/coupons', params)
}

/**
 * 领取优惠券
 */
export function claimCoupon(couponId: number) {
  return httpPost(`/coupons/${couponId}/claim`)
}

/**
 * 兑换优惠券
 */
export function redeemCoupon(code: string) {
  return httpPost('/coupons/redeem', { code })
}

/**
 * 获取可用优惠券
 */
export function getAvailableCoupons(amount: number) {
  return httpGet<Coupon[]>('/coupons/available', { amount })
}
