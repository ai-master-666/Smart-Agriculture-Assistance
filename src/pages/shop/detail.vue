<template>
  <view class="detail-container" v-if="product">
    <image :src="product.cover_image || '/static/logo.png'" mode="aspectFill" class="detail-img"></image>
    
    <view class="detail-content">
      <view class="price-section">
        <text class="price">¥{{ product.price }}</text>
        <text class="original-price" v-if="product.original_price">¥{{ product.original_price }}</text>
      </view>
      
      <text class="title">{{ product.name }}</text>
      
      <view class="meta-info">
        <view class="meta-item" v-if="product.village">
          <u-icon name="map" size="14" color="#666"></u-icon>
          <text>{{ product.village }}</text>
        </view>
        <view class="meta-item">
          <text>销量 {{ product.sales_count || 0 }}</text>
        </view>
        <view class="meta-item">
          <text>库存 {{ product.stock || 0 }}</text>
        </view>
      </view>

      <view class="divider"></view>

      <!-- 规格选择入口 -->
      <view class="sku-cell" @click="openSku">
        <text class="label">选择</text>
        <text class="value">{{ selectedSkuText || '请选择规格' }}</text>
        <u-icon name="arrow-right" size="14" color="#999"></u-icon>
      </view>
      
      <view class="divider"></view>

      <!-- 评价预览 -->
      <view class="review-section">
        <view class="section-header" @click="goToReviews">
          <text class="section-title">商品评价 ({{ product.review_count || 0 }})</text>
          <u-icon name="arrow-right" size="14" color="#999"></u-icon>
        </view>
        
        <view class="review-item" v-if="product.reviews && product.reviews.length > 0">
          <view class="review-header">
            <image :src="product.reviews[0].avatar || '/static/default-avatar.png'" class="avatar"></image>
            <text class="nickname">{{ product.reviews[0].nickname }}</text>
            <u-rate :count="5" v-model="product.reviews[0].rating" readonly size="12"></u-rate>
          </view>
          <text class="review-content">{{ product.reviews[0].content }}</text>
        </view>
        <view class="empty-review" v-else>
          <text>暂无评价，快来抢沙发~</text>
        </view>
      </view>
      
      <view class="divider"></view>
      
      <view class="description-section">
        <text class="section-title">商品详情</text>
        <text class="description">{{ product.description || '暂无详细描述' }}</text>
      </view>
    </view>
    
    <view class="action-bar">
      <view class="icon-btn" @click="goToHome">
        <u-icon name="home" size="24" color="#666"></u-icon>
        <text>首页</text>
      </view>
      <view class="icon-btn" @click="toggleFavorite">
        <u-icon :name="isFavorite ? 'star-fill' : 'star'" size="24" :color="isFavorite ? '#ff4d4f' : '#666'"></u-icon>
        <text>收藏</text>
      </view>
      <view class="icon-btn" @click="goToCart">
        <u-icon name="shopping-cart" size="24" color="#666"></u-icon>
        <text>购物车</text>
      </view>
      <button class="add-cart-btn" @click="openSku">加入购物车</button>
      <button class="buy-now-btn" @click="openSku">立即购买</button>
    </view>

    <!-- SKU Popup -->
    <u-popup :show="showSku" @close="closeSku" mode="bottom" round="16" :closeable="true">
      <view class="sku-popup">
        <view class="sku-header">
          <image :src="product.cover_image || '/static/default-product.png'" mode="aspectFill" class="sku-img"></image>
          <view class="sku-info">
            <text class="sku-price">¥{{ currentPrice }}</text>
            <text class="sku-stock">库存 {{ currentStock }} 件</text>
            <text class="sku-selected">已选：{{ selectedSpec || '请选择规格' }}</text>
          </view>
        </view>
        
        <scroll-view scroll-y class="sku-scroll">
          <view class="sku-group">
            <text class="group-title">规格</text>
            <view class="spec-list">
              <view 
                class="spec-item" 
                v-for="(spec, index) in specs" 
                :key="index"
                :class="{ active: selectedSpec === spec.name }"
                @click="selectSpec(spec)"
              >
                {{ spec.name }}
              </view>
            </view>
          </view>
          
          <view class="count-box">
            <text class="label">购买数量</text>
            <u-number-box v-model="buyCount" :min="1" :max="currentStock" integer></u-number-box>
          </view>
        </scroll-view>
        
        <view class="sku-footer">
          <button class="confirm-btn" @click="confirmSku">确定</button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getProductDetail, addToCart } from '@/api/product'
import type { Product } from '@/api/product'

const product = ref<Product | null>(null)
const isFavorite = ref(false)
const showSku = ref(false)
const buyCount = ref(1)
const selectedSpec = ref('')

// Mock SKU data
const specs = ref([
  { name: '500g', price: 0, stock: 100 },
  { name: '1kg', price: 10, stock: 50 }, // Price diff
  { name: '2.5kg礼盒装', price: 40, stock: 20 }
])

const currentPrice = computed(() => {
  if (!product.value) return '0.00'
  const spec = specs.value.find(s => s.name === selectedSpec.value)
  const basePrice = Number(product.value.price)
  if (spec) {
    return (basePrice + spec.price).toFixed(2)
  }
  return basePrice.toFixed(2)
})

const currentStock = computed(() => {
    if (!product.value) return 0
    const spec = specs.value.find(s => s.name === selectedSpec.value)
    return spec ? spec.stock : (product.value.stock || 0)
})

const selectedSkuText = computed(() => {
    if (!selectedSpec.value) return ''
    return `${selectedSpec.value}, ${buyCount.value}件`
})

onLoad(async (options: any) => {
  if (options.id) {
    try {
      const res = await getProductDetail(Number(options.id))
      if (res) {
        product.value = res
        // 模拟评价数据
        product.value.review_count = 128
        product.value.reviews = [
          {
            avatar: 'https://cdn.uviewui.com/uview/album/1.jpg',
            nickname: '李**',
            rating: 5,
            content: '非常新鲜，包装也很好，第二天就到了！'
          }
        ]
        
        // Auto select first spec
        if (specs.value.length > 0) {
            selectedSpec.value = specs.value[0].name
        }
      }
    } catch (e) {
      console.error('Failed to load product detail:', e)
      uni.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  }
})

const goToHome = () => {
  uni.switchTab({ url: '/pages/shop/index' })
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  uni.showToast({
    title: isFavorite.value ? '已收藏' : '已取消收藏',
    icon: 'none'
  })
}

const goToReviews = () => {
  uni.showToast({ title: '查看全部评价', icon: 'none' })
}

const openSku = () => {
  showSku.value = true
}

const closeSku = () => {
  showSku.value = false
}

const selectSpec = (spec: any) => {
  selectedSpec.value = spec.name
}

const confirmSku = () => {
  handleAddToCart()
  closeSku()
}

const handleAddToCart = async () => {
  if (product.value) {
    try {
      // Pass SKU info to API (mock logic as API might not support it yet)
      await addToCart(product.value.id, buyCount.value)
      uni.showToast({
        title: '已加入购物车',
        icon: 'success'
      })
    } catch (e) {
      console.error(e)
      uni.showToast({
        title: '加入失败',
        icon: 'none'
      })
    }
  }
}

const handleBuyNow = () => {
    openSku()
}

const goToCart = () => {
  uni.navigateTo({
    url: '/pages/shop/cart'
  })
}
</script>

<style lang="scss" scoped>
.detail-container {
  padding-bottom: 120rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.detail-img {
  width: 100%;
  height: 600rpx;
  background-color: #fff;
}

.detail-content {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 20rpx 20rpx 0 0;
  margin-top: -20rpx;
  position: relative;
  z-index: 1;
}

.price-section {
  display: flex;
  align-items: baseline;
  margin-bottom: 20rpx;
  
  .price {
    color: #ff4d4f;
    font-size: 48rpx;
    font-weight: bold;
    margin-right: 20rpx;
  }
  
  .original-price {
    color: #999;
    font-size: 28rpx;
    text-decoration: line-through;
  }
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  margin-bottom: 20rpx;
  display: block;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 24rpx;
  margin-bottom: 30rpx;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 4rpx;
  }
}

.divider {
  height: 20rpx;
  background-color: #f8f8f8;
  margin: 0 -30rpx 30rpx;
}

.sku-cell {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
  
  .label {
    font-size: 28rpx;
    color: #999;
    width: 80rpx;
  }
  
  .value {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }
}

.review-section {
  margin-bottom: 30rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 0;
      border-left: none;
      padding-left: 0;
    }
  }
  
  .review-item {
    background: #f9f9f9;
    padding: 20rpx;
    border-radius: 12rpx;
    
    .review-header {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;
      
      .avatar {
        width: 48rpx;
        height: 48rpx;
        border-radius: 50%;
        margin-right: 12rpx;
      }
      
      .nickname {
        font-size: 26rpx;
        color: #333;
        margin-right: 16rpx;
      }
    }
    
    .review-content {
      font-size: 26rpx;
      color: #666;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
  
  .empty-review {
    padding: 30rpx 0;
    text-align: center;
    font-size: 26rpx;
    color: #999;
  }
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: block;
  border-left: 6rpx solid #667eea;
  padding-left: 16rpx;
}

.description {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  box-sizing: border-box;
  z-index: 100;
  
  .icon-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 20rpx;
    color: #666;
    margin-right: 30rpx;
    margin-left: 10rpx;
  }
  
  button {
    flex: 1;
    height: 72rpx;
    line-height: 72rpx;
    border-radius: 36rpx;
    font-size: 28rpx;
    margin: 0 10rpx;
    
    &::after {
      border: none;
    }
  }
  
  .add-cart-btn {
    background: #ffecd2;
    color: #ff4d4f;
  }
  
  .buy-now-btn {
    background: linear-gradient(to right, #ff6b81, #ff4757);
    color: #fff;
  }
}

.sku-popup {
  padding: 30rpx;
  background: #fff;
  min-height: 600rpx;
  display: flex;
  flex-direction: column;
  
  .sku-header {
    display: flex;
    margin-bottom: 30rpx;
    
    .sku-img {
      width: 180rpx;
      height: 180rpx;
      border-radius: 12rpx;
      margin-right: 20rpx;
      background: #f5f5f5;
    }
    
    .sku-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      
      .sku-price {
        font-size: 40rpx;
        color: #ff4d4f;
        font-weight: bold;
        margin-bottom: 8rpx;
      }
      
      .sku-stock {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 8rpx;
      }
      
      .sku-selected {
        font-size: 26rpx;
        color: #333;
      }
    }
  }
  
  .sku-scroll {
    flex: 1;
    max-height: 600rpx;
    
    .sku-group {
      margin-bottom: 30rpx;
      
      .group-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
        display: block;
      }
      
      .spec-list {
        display: flex;
        flex-wrap: wrap;
        
        .spec-item {
          padding: 10rpx 30rpx;
          background: #f5f5f5;
          border-radius: 30rpx;
          font-size: 26rpx;
          color: #333;
          margin-right: 20rpx;
          margin-bottom: 20rpx;
          border: 2rpx solid transparent;
          
          &.active {
            background: #fff1f0;
            color: #ff4d4f;
            border-color: #ff4d4f;
          }
        }
      }
    }
    
    .count-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 40rpx;
      margin-bottom: 40rpx;
      
      .label {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
      }
    }
  }
  
  .sku-footer {
    padding-top: 20rpx;
    
    .confirm-btn {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      background: linear-gradient(135deg, #ff6034, #ee0a24);
      color: #fff;
      border-radius: 40rpx;
      font-size: 30rpx;
      font-weight: bold;
      border: none;
      
      &::after {
        border: none;
      }
    }
  }
}
</style>
