/**
 * 商品相关 API
 */
import { httpGet, httpPost } from '@/utils/request'

export interface Product {
  id: number
  name: string
  price: number
  original_price?: number
  cover_image?: string
  village?: string
  unit?: string
  description?: string
  sales_count?: number
  stock?: number
}

/**
 * 获取商品列表
 */
export async function getProductList(params?: any) {
  try {
    const res = await httpGet<any>('/products', params, false)
    // 适配后端返回结构: { data: { items: [], ... } }
    if (res && res.items) {
      return res.items
    }
    // 如果直接返回数组
    if (Array.isArray(res)) {
      return res
    }
    return []
  } catch (error) {
    console.error('API Error, using mock data', error)
    // Mock data fallback
    return [
      {
        id: 1,
        name: '有机大米',
        price: 25.00,
        original_price: 30.00,
        cover_image: '/static/default-product.png',
        village: '桃源村',
        unit: '斤',
        description: '来自深山有机梯田，无农药，口感香甜',
        sales_count: 328,
        stock: 1000
      },
      {
        id: 2,
        name: '高山茶叶',
        price: 88.00,
        original_price: 128.00,
        cover_image: '/static/default-product.png',
        village: '云雾村',
        unit: '盒',
        description: '海拔1200米云雾茶，手工采摘，清香怡人',
        sales_count: 156,
        stock: 500
      },
      {
        id: 3,
        name: '土鸡蛋',
        price: 35.00,
        cover_image: '/static/default-product.png',
        village: '张家寨',
        unit: '箱',
        description: '散养土鸡蛋，30枚/箱，营养丰富',
        sales_count: 212,
        stock: 300
      }
    ]
  }
}

/**
 * 获取商品详情
 */
export function getProductDetail(id: number) {
  return httpGet<Product>(`/products/${id}`, {}, false)
}

/**
 * 添加到购物车
 */
export function addToCart(productId: number, quantity: number = 1) {
  return httpPost('/cart/items', { product_id: productId, quantity })
}

/**
 * 获取购物车列表
 */
export function getCartList() {
  return httpGet<any>('/cart/items')
}
