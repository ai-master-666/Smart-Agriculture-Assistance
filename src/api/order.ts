import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/request'

export interface CartItem {
  id: number
  product_id: number
  product_name: string
  product_image: string
  price: number
  quantity: number
  subtotal: number
  selected?: boolean // 前端辅助字段
}

export interface OrderItem {
  product_id: number
  product_name: string
  product_image: string
  quantity: number
  price: number
}

export interface Order {
  id: number
  order_no: string
  total_price: number
  status: string // pending_payment, pending_shipment, shipped, completed, cancelled, refunding, refunded
  create_time: string
  items?: OrderItem[]
  address?: any
  logistics_company?: string
  logistics_no?: string
  remark?: string
  buyer_name?: string // 卖家视角
  buyer_avatar?: string
}

/**
 * 获取购物车列表
 */
export function getCartList() {
  return httpGet<{ items: CartItem[], total: number }>('/cart')
}

/**
 * 添加到购物车
 */
export function addToCart(productId: number, quantity: number = 1) {
  return httpPost('/cart/items', { product_id: productId, quantity })
}

/**
 * 更新购物车数量
 */
export function updateCartItem(cartId: number, quantity: number) {
  return httpPut(`/cart/items/${cartId}?quantity=${quantity}`)
}

export function updateCartItemQuery(cartId: number, quantity: number) {
    return httpPut(`/cart/items/${cartId}?quantity=${quantity}`)
}

/**
 * 删除购物车项
 */
export function removeCartItem(cartId: number) {
  return httpDelete(`/cart/items/${cartId}`)
}

/**
 * 创建订单
 */
export function createOrder(data: { items: { product_id: number, quantity: number }[], address: any, remark?: string }) {
  return httpPost('/orders', data)
}

/**
 * 获取订单列表 (买家)
 */
export async function getOrderList(params?: { status?: string, page?: number, page_size?: number }) {
  try {
      return await httpGet<Order[]>('/orders', params)
  } catch (e) {
      console.error('API Error, using mock data', e)
      return [
        {
          id: 1,
          order_no: 'ORD202603070001',
          status: 'pending_payment',
          total_amount: 99.8,
          create_time: '2026-03-07 12:00:00',
          total_price: 99.8,
          items: [
            {
              product_id: 1,
              product_name: '农家土鸡蛋',
              price: 49.9,
              quantity: 2,
              product_image: '/static/default-product.png'
            }
          ]
        }
      ]
  }
}

/**
 * 获取订单详情
 */
export function getOrderDetail(orderId: number) {
  return httpGet<Order>(`/orders/${orderId}`)
}

/**
 * 取消订单
 */
export function cancelOrder(orderId: number) {
  return httpPost(`/orders/${orderId}/cancel`)
}

// --- 卖家相关接口 ---

/**
 * 获取卖家订单列表
 */
export async function getFarmerOrderList(params?: { status?: string, page?: number, page_size?: number }) {
  try {
    return await httpGet<Order[]>('/farmer/orders', params)
  } catch (e) {
    console.error('API Error, using mock data', e)
    // Mock data for farmer
    return [
      {
        id: 101,
        order_no: 'ORD202603080001',
        status: 'pending_shipment',
        total_price: 128.00,
        create_time: '2026-03-08 09:30:00',
        buyer_name: '李雷',
        address: {
          name: '李雷',
          phone: '13800138000',
          detail: '北京市朝阳区三里屯SOHO'
        },
        items: [
          {
            product_id: 2,
            product_name: '高山茶叶',
            price: 128.00,
            quantity: 1,
            product_image: '/static/default-product.png'
          }
        ]
      },
      {
        id: 102,
        order_no: 'ORD202603080002',
        status: 'refunding',
        total_price: 58.00,
        create_time: '2026-03-08 10:15:00',
        buyer_name: '韩梅梅',
        address: {
          name: '韩梅梅',
          phone: '13900139000',
          detail: '上海市浦东新区陆家嘴'
        },
        items: [
          {
            product_id: 3,
            product_name: '农家自制腊肉',
            price: 58.00,
            quantity: 1,
            product_image: '/static/default-product.png'
          }
        ]
      }
    ]
  }
}

/**
 * 订单发货
 */
export function shipOrder(orderId: number, logistics: { company: string, no: string }) {
  return httpPost(`/farmer/orders/${orderId}/ship`, logistics)
}

/**
 * 处理售后 (退款)
 */
export function refundOrder(orderId: number, action: 'approve' | 'reject', reason?: string) {
  return httpPost(`/farmer/orders/${orderId}/refund`, { action, reason })
}
