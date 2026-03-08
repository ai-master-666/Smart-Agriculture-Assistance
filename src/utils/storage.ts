/**
 * 本地存储封装
 */
const PREFIX = 'smart_agro_'

export const storage = {
  get<T = any>(key: string): T | null {
    try {
      const value = uni.getStorageSync(PREFIX + key)
      return value ? JSON.parse(value) : null
    } catch (e) {
      console.error('Storage get error:', e)
      return null
    }
  },
  
  set<T = any>(key: string, value: T): void {
    try {
      uni.setStorageSync(PREFIX + key, JSON.stringify(value))
    } catch (e) {
      console.error('Storage set error:', e)
    }
  },
  
  remove(key: string): void {
    try {
      uni.removeStorageSync(PREFIX + key)
    } catch (e) {
      console.error('Storage remove error:', e)
    }
  },
  
  clear(): void {
    try {
      uni.clearStorageSync()
    } catch (e) {
      console.error('Storage clear error:', e)
    }
  }
}
