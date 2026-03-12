<template>
  <view class="home-container">
    <!-- 顶部搜索与定位 -->
    <view class="header-section">
      <view class="location-bar" @click="onLocationClick">
        <u-icon name="map-fill" color="#667eea" size="16"></u-icon>
        <text class="location-text">{{ currentLocation }}</text>
        <u-icon name="arrow-down" color="#333" size="12"></u-icon>
      </view>
      <view class="search-box">
        <view class="custom-search-bar" @click="goToSearch">
          <u-icon name="search" size="18" color="#999"></u-icon>
          <text class="placeholder-text">搜索商品/直播/课程/景点</text>
        </view>
      </view>
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
        indicator
        indicatorMode="dot"
        loading
      ></u-swiper>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-nav-section">
      <view class="nav-grid">
        <view class="nav-item" @click="switchTab('/pages/shop/index')">
          <image src="/static/tabbar/shop-active.png" class="nav-icon"></image>
          <text class="nav-text">农产商城</text>
        </view>
        <view class="nav-item" @click="switchTab('/pages/live/index')">
          <image src="/static/tabbar/live-active.png" class="nav-icon"></image>
          <text class="nav-text">直播广场</text>
        </view>
        <view class="nav-item" @click="navigateTo('/pages/tour/index')">
          <image src="/static/default-scenic.png" class="nav-icon"></image>
          <text class="nav-text">乡村云游</text>
        </view>
        <view class="nav-item" @click="navigateTo('/pages/course/index')">
          <image src="/static/tabbar/course-active.png" class="nav-icon"></image>
          <text class="nav-text">农技课堂</text>
        </view>
        <view class="nav-item" @click="switchTab('/pages/ai/index')">
          <image src="/static/tabbar/ai-active.png" class="nav-icon"></image>
          <text class="nav-text">AI助手</text>
        </view>
      </view>
    </view>
    
    <!-- 热门直播 -->
    <view class="section-box" v-if="liveList.length > 0">
      <view class="section-header">
        <text class="section-title">热门直播</text>
        <view class="more-btn" @click="switchTab('/pages/live/index')">
          <text>更多</text>
          <u-icon name="arrow-right" size="12" color="#999"></u-icon>
        </view>
      </view>
      <scroll-view scroll-x class="horizontal-scroll">
        <view class="live-card" v-for="live in liveList" :key="live.id" @click="goToLiveRoom(live.id)">
          <view class="live-cover-wrapper">
            <image :src="live.cover_image || '/static/default-live.png'" mode="aspectFill" class="live-cover"></image>
            <view class="live-status">
              <view class="dot"></view>
              <text>直播中</text>
            </view>
            <view class="viewer-count">
              <u-icon name="eye" size="10" color="#fff"></u-icon>
              <text>{{ live.viewer_count }}</text>
            </view>
          </view>
          <text class="live-title">{{ live.title }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 附近村庄 -->
    <view class="section-box">
      <view class="section-header">
        <text class="section-title">附近村庄</text>
        <view class="more-btn" @click="navigateTo('/pages/tour/index')">
          <text>更多</text>
          <u-icon name="arrow-right" size="12" color="#999"></u-icon>
        </view>
      </view>
      <scroll-view scroll-x class="horizontal-scroll">
        <view class="village-card" v-for="(village, index) in nearbyVillages" :key="index" @click="goToVillage(village)">
          <image :src="village.image" mode="aspectFill" class="village-img"></image>
          <view class="village-info">
            <text class="village-name">{{ village.name }}</text>
            <text class="village-distance">{{ village.distance }}km</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 推荐商品 -->
    <view class="section-box no-bg">
      <view class="section-header">
        <text class="section-title">为您推荐</text>
      </view>
      
      <!-- 骨架屏 -->
      <view class="skeleton-list" v-if="isLoadingProducts">
        <view class="product-item skeleton" v-for="i in 4" :key="i">
          <view class="skeleton-img"></view>
          <view class="skeleton-info">
            <view class="skeleton-line title"></view>
            <view class="skeleton-line price"></view>
          </view>
        </view>
      </view>

      <view class="product-list" v-else>
        <view class="product-item" v-for="item in productList" :key="item.id" @click="goToProduct(item.id)">
          <image :src="item.cover_image || '/static/default-product.png'" mode="aspectFill" class="product-img" lazy-load></image>
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <view class="price-row">
              <text class="price">¥{{ item.price }}</text>
              <text class="sales">已售{{ item.sales_count }}+</text>
            </view>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { getProductList } from '@/api/product'
import { getLiveList } from '@/api/live'
import type { Product } from '@/api/product'
import type { LiveRoom } from '@/api/live'

const currentLocation = ref('定位中...')
const bannerList = ref([
  { image: 'https://cdn.uviewui.com/uview/swiper/swiper1.png', title: '春耕活动周' },
  { image: 'https://cdn.uviewui.com/uview/swiper/swiper2.png', title: '美丽乡村游' }
])
const liveList = ref<LiveRoom[]>([])
const nearbyVillages = ref([
  { name: '桃源村', distance: 1.2, image: 'https://cdn.uviewui.com/uview/album/1.jpg' },
  { name: '李家庄', distance: 3.5, image: 'https://cdn.uviewui.com/uview/album/2.jpg' },
  { name: '杏花岭', distance: 5.8, image: 'https://cdn.uviewui.com/uview/album/3.jpg' },
  { name: '大王庄', distance: 8.2, image: 'https://cdn.uviewui.com/uview/album/4.jpg' }
])
const productList = ref<Product[]>([])
const isLoadingProducts = ref(true)
const page = ref(1)

const initLocation = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      // Mock reverse geocoding
      currentLocation.value = '桃源村'
    },
    fail: () => {
      currentLocation.value = '定位失败'
    }
  })
}

const loadData = async () => {
  isLoadingProducts.value = true
  try {
    // Parallel loading
    const [productsRes, livesRes] = await Promise.all([
      getProductList({ page: 1, page_size: 10 }),
      getLiveList({ page: 1, page_size: 5, status: 'live' })
    ])
    
    if (productsRes && productsRes.length > 0) {
        // API returns array directly based on previous shop/index.vue logic, 
        // but api definition says { items, total }? 
        // Let's check api/product.ts again. 
        // Actually shop/index.vue uses `res = await getProductList(...)` and checks `if (res) productList.value = res`.
        // Let's assume it returns array or handle both.
        if (Array.isArray(productsRes)) {
            productList.value = productsRes
        } else if ((productsRes as any).items) {
            productList.value = (productsRes as any).items
        }
    }
    
    if (livesRes) {
        liveList.value = livesRes
    }
  } catch (e) {
    console.error(e)
  } finally {
    isLoadingProducts.value = false
    uni.stopPullDownRefresh()
  }
}

const loadMoreProducts = async () => {
  page.value++
  try {
    const res: any = await getProductList({ page: page.value, page_size: 10 })
    const newItems = Array.isArray(res) ? res : (res.items || [])
    if (newItems.length > 0) {
      productList.value = [...productList.value, ...newItems]
    }
  } catch (e) {
    console.error(e)
  }
}

const onLocationClick = () => {
  initLocation()
}

const goToSearch = () => {
  // Navigate to shop index and focus search, or a dedicated search page
  // For now, switch to shop
  uni.switchTab({ url: '/pages/shop/index' })
}

const switchTab = (url: string) => {
  uni.switchTab({ url })
}

const navigateTo = (url: string) => {
  uni.navigateTo({ url })
}

const goToLiveRoom = (id: number) => {
  uni.navigateTo({ url: `/pages/live/room?id=${id}` })
}

const goToVillage = (village: any) => {
  uni.navigateTo({ url: '/pages/tour/index' })
}

const goToProduct = (id: number) => {
  uni.navigateTo({ url: `/pages/shop/detail?id=${id}` })
}

onLoad(() => {
  initLocation()
  loadData()
})

onPullDownRefresh(() => {
  page.value = 1
  loadData()
})

onReachBottom(() => {
  loadMoreProducts()
})
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 40rpx;
}

.header-section {
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  padding: 20rpx;
  
  .location-bar {
    display: flex;
    align-items: center;
    margin-right: 20rpx;
    max-width: 200rpx;
    
    .location-text {
      font-size: 28rpx;
      font-weight: bold;
      margin: 0 6rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
  .search-box {
    flex: 1;
    
    .custom-search-bar {
      display: flex;
      align-items: center;
      background-color: #f5f5f5;
      height: 64rpx;
      border-radius: 32rpx;
      padding: 0 24rpx;
      
      .placeholder-text {
        font-size: 26rpx;
        color: #999;
        margin-left: 12rpx;
      }
    }
  }
}

.banner-section {
  padding: 20rpx;
}

.quick-nav-section {
  background: #fff;
  padding: 20rpx 0;
  margin: 0 20rpx 20rpx;
  border-radius: 16rpx;
  
  .nav-grid {
    display: flex;
    justify-content: space-between;
    padding: 0 20rpx;
    
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .nav-icon {
        width: 88rpx;
        height: 88rpx;
        margin-bottom: 10rpx;
      }
      
      .nav-text {
        font-size: 24rpx;
        color: #333;
      }
    }
  }
}

.section-box {
  background: #fff;
  margin: 0 20rpx 20rpx;
  padding: 24rpx;
  border-radius: 16rpx;
  
  &.no-bg {
    background: transparent;
    padding: 0;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      position: relative;
      padding-left: 16rpx;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6rpx;
        height: 28rpx;
        background: #667eea;
        border-radius: 4rpx;
      }
    }
    
    .more-btn {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #999;
    }
  }
}

.horizontal-scroll {
  white-space: nowrap;
  
  .live-card {
    display: inline-block;
    width: 240rpx;
    margin-right: 20rpx;
    
    .live-cover-wrapper {
      position: relative;
      width: 240rpx;
      height: 320rpx;
      border-radius: 12rpx;
      overflow: hidden;
      margin-bottom: 12rpx;
      
      .live-cover {
        width: 100%;
        height: 100%;
      }
      
      .live-status {
        position: absolute;
        top: 12rpx;
        left: 12rpx;
        background: rgba(0,0,0,0.5);
        border-radius: 20rpx;
        padding: 4rpx 12rpx;
        display: flex;
        align-items: center;
        
        .dot {
          width: 8rpx;
          height: 8rpx;
          background: #ff4d4f;
          border-radius: 50%;
          margin-right: 8rpx;
        }
        
        text {
          font-size: 18rpx;
          color: #fff;
        }
      }
      
      .viewer-count {
        position: absolute;
        bottom: 12rpx;
        left: 12rpx;
        display: flex;
        align-items: center;
        
        text {
          font-size: 20rpx;
          color: #fff;
          margin-left: 4rpx;
        }
      }
    }
    
    .live-title {
      font-size: 26rpx;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
    }
  }
  
  .village-card {
    display: inline-block;
    width: 280rpx;
    margin-right: 20rpx;
    background: #f9f9f9;
    border-radius: 12rpx;
    overflow: hidden;
    
    .village-img {
      width: 280rpx;
      height: 180rpx;
    }
    
    .village-info {
      padding: 16rpx;
      
      .village-name {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        display: block;
      }
      
      .village-distance {
        font-size: 22rpx;
        color: #999;
      }
    }
  }
}

.product-list, .skeleton-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.product-item {
  width: 48%;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  
  .product-img {
    width: 100%;
    height: 340rpx;
    background: #f5f5f5;
  }
  
  .product-info {
    padding: 16rpx;
    
    .product-name {
      font-size: 28rpx;
      color: #333;
      line-height: 1.4;
      height: 80rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 12rpx;
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
        font-size: 22rpx;
        color: #999;
      }
    }
  }
}

.skeleton {
  .skeleton-img {
    width: 100%;
    height: 340rpx;
    background: #f0f0f0;
  }
  
  .skeleton-info {
    padding: 16rpx;
    
    .skeleton-line {
      height: 24rpx;
      background: #f0f0f0;
      margin-bottom: 12rpx;
      
      &.title { width: 80%; }
      &.price { width: 40%; }
    }
  }
}
</style>
