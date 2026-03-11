<template>
  <view class="favorites-container">
    <view class="empty-state" v-if="favoriteList.length === 0">
      <u-empty mode="favor" text="暂无收藏" icon="/static/empty-favor.png"></u-empty>
    </view>
    
    <view class="product-list" v-else>
      <view class="product-item" v-for="item in favoriteList" :key="item.id" @click="goToDetail(item.id)">
        <view class="image-wrapper">
          <image :src="item.cover_image || '/static/default-product.png'" mode="aspectFill" class="product-img"></image>
        </view>
        <view class="product-info">
          <text class="product-name">{{ item.name }}</text>
          <view class="price-row">
            <text class="price">¥{{ item.price }}</text>
            <text class="sales">已售 {{ item.sales_count || 0 }}+</text>
          </view>
        </view>
        <view class="delete-btn" @click.stop="removeFavorite(item.id)">
          <u-icon name="trash" size="20" color="#999"></u-icon>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

interface Product {
  id: number
  name: string
  price: number
  cover_image?: string
  sales_count?: number
}

const favoriteList = ref<Product[]>([])

onShow(() => {
  // 模拟获取收藏列表
  // 真实开发需调用 API: const res = await getFavoriteList()
  favoriteList.value = [
    { id: 1, name: '高山有机绿茶', price: 128, sales_count: 500 },
    { id: 2, name: '农家散养土鸡蛋', price: 35, sales_count: 1200 },
    { id: 3, name: '新鲜时令草莓', price: 45, sales_count: 300 }
  ]
})

const goToDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/shop/detail?id=${id}`
  })
}

const removeFavorite = (id: number) => {
  uni.showModal({
    title: '提示',
    content: '确定取消收藏该商品吗？',
    success: (res) => {
      if (res.confirm) {
        favoriteList.value = favoriteList.value.filter(item => item.id !== id)
        uni.showToast({ title: '已取消', icon: 'none' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.favorites-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 20rpx;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.product-item {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  position: relative;
  
  .image-wrapper {
    width: 180rpx;
    height: 180rpx;
    border-radius: 12rpx;
    overflow: hidden;
    margin-right: 20rpx;
    
    .product-img {
      width: 100%;
      height: 100%;
    }
  }
  
  .product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10rpx 0;
    
    .product-name {
      font-size: 30rpx;
      color: #333;
      font-weight: bold;
      line-height: 1.4;
    }
    
    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      
      .price {
        font-size: 32rpx;
        color: #ff4d4f;
        font-weight: bold;
      }
      
      .sales {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
  
  .delete-btn {
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
    padding: 10rpx;
  }
}

.empty-state {
  margin-top: 200rpx;
}
</style>
