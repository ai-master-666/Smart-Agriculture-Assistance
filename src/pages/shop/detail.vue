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
      <button class="add-cart-btn" @click="handleAddToCart">加入购物车</button>
      <button class="buy-now-btn" @click="handleBuyNow">立即购买</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getProductDetail, addToCart } from '@/api/product'
import type { Product } from '@/api/product'

const product = ref<Product | null>(null)
const isFavorite = ref(false)

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

const handleAddToCart = async () => {
  if (product.value) {
    try {
      await addToCart(product.value.id, 1)
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
  // TODO: Implement buy now logic
  handleAddToCart().then(() => {
    uni.navigateTo({
      url: '/pages/shop/cart'
    })
  })
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
</style>
