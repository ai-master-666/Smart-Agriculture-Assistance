<template>
  <view class="shop-container">
    <!-- 顶部搜索 -->
    <view class="header-section">
      <u-search 
        placeholder="搜索农产品" 
        v-model="keyword" 
        :show-action="false"
        bg-color="#f5f5f5"
        @search="onSearch" 
        @custom="onSearch"
      ></u-search>
    </view>
    
    <!-- 轮播图 -->
    <view class="banner-section">
      <u-swiper
        :list="bannerList"
        keyName="image"
        showTitle
        :autoplay="true"
        circular
        radius="12"
        height="300"
      ></u-swiper>
    </view>

    <!-- 分类导航 -->
    <view class="category-section">
      <u-grid :col="5" :border="false">
        <u-grid-item
          v-for="(item, index) in categoryList"
          :key="index"
          customStyle="padding-top: 20rpx; padding-bottom: 20rpx"
          @click="onCategoryClick(item)"
        >
          <view class="category-icon">{{ item.icon }}</view>
          <text class="category-text">{{ item.name }}</text>
        </u-grid-item>
      </u-grid>
    </view>
    
    <!-- 推荐商品 -->
    <view class="section-header">
      <text class="section-title">热门推荐</text>
      <text class="section-more">查看更多 ></text>
    </view>

    <view class="product-list" v-if="productList && productList.length > 0">
      <view class="product-item" v-for="item in productList" :key="item.id" @click="goToDetail(item.id)">
        <view class="image-wrapper">
          <image :src="item.cover_image || '/static/logo.png'" mode="aspectFill" class="product-img"></image>
          <view class="village-tag" v-if="item.village">{{ item.village }}</view>
        </view>
        
        <view class="product-info">
          <text class="product-name">{{ item.name }}</text>
          <text class="product-desc" v-if="item.description">{{ item.description }}</text>
          
          <view class="price-row">
            <view class="price-box">
              <text class="currency">¥</text>
              <text class="price">{{ item.price }}</text>
              <text class="unit" v-if="item.unit">/{{ item.unit }}</text>
            </view>
            <text class="sales">已售{{ item.sales_count || 0 }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="empty-state" v-else>
      <u-empty mode="data" text="暂无商品" icon="/static/empty-cart.png"></u-empty>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getProductList } from '@/api/product'
import type { Product } from '@/api/product'

const keyword = ref('')
const productList = ref<Product[]>([])

// 模拟轮播图数据
const bannerList = ref([
  {
    image: 'https://cdn.uviewui.com/uview/swiper/swiper1.png',
    title: '春耕好时节，优质农产品大促'
  },
  {
    image: 'https://cdn.uviewui.com/uview/swiper/swiper2.png',
    title: '乡村文化游，探索古村落之美'
  },
  {
    image: 'https://cdn.uviewui.com/uview/swiper/swiper3.png',
    title: '新农人培训，技能提升助振兴'
  }
])

// 模拟分类数据
const categoryList = ref([
  { name: '蔬菜水果', icon: '🥦' },
  { name: '粮油米面', icon: '🌾' },
  { name: '禽蛋肉类', icon: '🥚' },
  { name: '土特产', icon: '🎋' },
  { name: '茶叶饮品', icon: '🍵' },
  { name: '中药材', icon: '🌿' },
  { name: '手工制品', icon: '🧶' },
  { name: '乡村游', icon: '🏞️' },
  { name: '认养农业', icon: '🐖' },
  { name: '全部分类', icon: 'more' }
])

const loadProducts = async () => {
  try {
    const res = await getProductList({ keyword: keyword.value })
    if (res) {
      productList.value = res
    }
  } catch (e) {
    console.error('Failed to load products:', e)
  }
}

const onSearch = () => {
  loadProducts()
}

const onCategoryClick = (item: any) => {
  uni.showToast({
    title: `点击了${item.name}`,
    icon: 'none'
  })
}

const goToDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/shop/detail?id=${id}`
  })
}

onLoad(() => {
  loadProducts()
})
</script>

<style lang="scss" scoped>
.shop-container {
  padding: 20rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.header-section {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  padding: 20rpx;
  margin: -20rpx -20rpx 20rpx -20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.02);
}

.banner-section {
  margin-bottom: 30rpx;
}

.category-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx 0;
  margin-bottom: 30rpx;
  
  .category-icon {
    font-size: 48rpx;
    margin-bottom: 10rpx;
  }
  
  .category-text {
    font-size: 24rpx;
    color: #666;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 0 10rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    position: relative;
    padding-left: 20rpx;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 8rpx;
      height: 32rpx;
      background: linear-gradient(to bottom, #667eea, #764ba2);
      border-radius: 4rpx;
    }
  }
  
  .section-more {
    font-size: 24rpx;
    color: #999;
  }
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.product-item {
  width: 48%;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
  transition: transform 0.2s;
  
  &:active {
    transform: scale(0.98);
  }
  
  .image-wrapper {
    position: relative;
    width: 100%;
    height: 340rpx;
    
    .product-img {
      width: 100%;
      height: 100%;
      background-color: #f5f5f5;
    }
    
    .village-tag {
      position: absolute;
      bottom: 16rpx;
      left: 16rpx;
      background-color: rgba(0,0,0,0.6);
      color: #fff;
      font-size: 20rpx;
      padding: 4rpx 12rpx;
      border-radius: 20rpx;
      backdrop-filter: blur(4rpx);
    }
  }
  
  .product-info {
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    
    .product-name {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 8rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .product-desc {
      font-size: 22rpx;
      color: #999;
      margin-bottom: 16rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      
      .price-box {
        color: #ff4d4f;
        display: flex;
        align-items: baseline;
        
        .currency {
          font-size: 24rpx;
          margin-right: 2rpx;
        }
        
        .price {
          font-size: 36rpx;
          font-weight: bold;
        }
        
        .unit {
          font-size: 22rpx;
          color: #999;
          margin-left: 4rpx;
        }
      }
      
      .sales {
        font-size: 20rpx;
        color: #bbb;
      }
    }
  }
}

.empty-state {
  margin-top: 100rpx;
}
</style>
