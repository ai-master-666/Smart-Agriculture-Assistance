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
      
      <view class="description-section">
        <text class="section-title">商品详情</text>
        <text class="description">{{ product.description || '暂无详细描述' }}</text>
      </view>
    </view>
    
    <view class="action-bar">
      <view class="icon-btn" @click="goToCart">
        <u-icon name="shopping-cart" size="24" color="#333"></u-icon>
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

onLoad(async (options: any) => {
  if (options.id) {
    try {
      const res = await getProductDetail(Number(options.id))
      if (res) {
        product.value = res
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
