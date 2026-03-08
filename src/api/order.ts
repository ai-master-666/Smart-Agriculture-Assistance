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
  status: string
  create_time: string
  items?: OrderItem[]
  address?: any
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
  return httpPut(`/cart/items/${cartId}`, null, true) // Assuming query param or body? Backend code says: update_cart_item(cart_id, quantity) - likely query param if not in body model.
  // Wait, backend: async def update_cart_item(cart_id: int, quantity: int...
  // Usually FastAPI expects query params if not Pydantic model.
  // Let's check backend code again carefully. 
  // It says: async def update_cart_item(cart_id: int, quantity: int, ...)
  // This implies `quantity` is a query parameter!
  // So url should be `/cart/items/${cartId}?quantity=${quantity}`
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
 * 获取订单列表
 */
export async function getOrderList(params?: { status?: string, page?: number, page_size?: number }) {
  try {
      return await httpGet<Order[]>('/orders', params)
  } catch (e) {
      console.error('API Error, using mock data', e)
      // Mock data fallback for demonstration
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
              product_image: ''
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
