<template>
  <view class="shop-container">
    <!-- 顶部搜索与定位 -->
    <view class="header-section">
      <view class="location-bar" @click="onLocationClick">
        <u-icon name="map-fill" color="#667eea" size="16"></u-icon>
        <text class="location-text">{{ currentLocation }}</text>
        <u-icon name="arrow-down" color="#333" size="12"></u-icon>
      </view>
      <view class="search-box">
        <view class="custom-search-bar">
          <u-icon name="search" size="18" color="#999"></u-icon>
          <input 
            class="search-input" 
            type="text" 
            v-model="keyword" 
            placeholder="搜索农产品/乡村景点" 
            placeholder-class="placeholder-style"
            confirm-type="search"
            @confirm="onSearch"
          />
          <view class="search-action" @click="onSearch">
            <view class="divider"></view>
            <text class="search-text">搜索</text>
          </view>
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

    <!-- 金刚区分类导航 -->
    <view class="category-section">
      <u-scroll-list :indicator="categoryList.length > 5">
        <view class="category-grid">
          <view
            class="category-item"
            v-for="(item, index) in categoryList"
            :key="index"
            @click="onCategoryClick(item)"
          >
            <view class="category-icon-wrapper" :style="{ background: item.color }">
              <text class="category-emoji">{{ item.icon }}</text>
            </view>
            <text class="category-text">{{ item.name }}</text>
          </view>
        </view>
      </u-scroll-list>
    </view>
    
    <!-- 营销活动区 -->
    <view class="marketing-section">
      <view class="marketing-card left" @click="goToLive">
        <view class="card-content">
          <text class="card-title">乡村直播</text>
          <text class="card-subtitle">看直播 抢好货</text>
          <view class="live-tag">
            <view class="dot"></view>
            <text>直播中</text>
          </view>
        </view>
        <image src="/static/default-live.png" mode="aspectFit" class="card-img"></image>
      </view>
      <view class="marketing-right">
        <view class="marketing-card right-top" @click="goToDiscount">
          <view class="card-content">
            <text class="card-title">限时特惠</text>
            <text class="card-subtitle">低至5折起</text>
          </view>
          <image src="/static/default-product.png" mode="aspectFit" class="card-img-sm"></image>
        </view>
        <view class="marketing-card right-bottom" @click="goToNew">
          <view class="card-content">
            <text class="card-title">新品尝鲜</text>
            <text class="card-subtitle">时令生鲜</text>
          </view>
          <image src="/static/default-product.png" mode="aspectFit" class="card-img-sm"></image>
        </view>
      </view>
    </view>

    <!-- 推荐商品 -->
    <view class="section-header">
      <view class="title-wrapper">
        <text class="section-title">热门推荐</text>
        <text class="section-subtitle">精选优质农特产品</text>
      </view>
      <view class="filter-tabs">
        <text :class="['filter-item', currentFilter === 'all' ? 'active' : '']" @click="switchFilter('all')">综合</text>
        <text :class="['filter-item', currentFilter === 'sales' ? 'active' : '']" @click="switchFilter('sales')">销量</text>
        <text :class="['filter-item', currentFilter === 'price' ? 'active' : '']" @click="switchFilter('price')">价格</text>
      </view>
    </view>

    <!-- 骨架屏 -->
    <view class="skeleton-list" v-if="isLoading">
      <view class="product-item skeleton" v-for="i in 4" :key="i">
        <view class="skeleton-img"></view>
        <view class="skeleton-info">
          <view class="skeleton-line title"></view>
          <view class="skeleton-line desc"></view>
          <view class="skeleton-line price"></view>
        </view>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="product-list" v-else-if="productList && productList.length > 0">
      <view class="product-item" v-for="item in productList" :key="item.id" @click="goToDetail(item.id)">
        <view class="image-wrapper">
          <image :src="item.cover_image || '/static/default-product.png'" mode="aspectFill" class="product-img" lazy-load></image>
          <view class="village-tag" v-if="item.village">
            <u-icon name="map-fill" size="10" color="#fff"></u-icon>
            <text>{{ item.village }}</text>
          </view>
        </view>
        
        <view class="product-info">
          <text class="product-name">{{ item.name }}</text>
          <view class="tags-row">
            <text class="tag red">包邮</text>
            <text class="tag green">现摘</text>
          </view>
          
          <view class="price-row">
            <view class="price-box">
              <text class="currency">¥</text>
              <text class="price">{{ item.price }}</text>
              <text class="unit" v-if="item.unit">/{{ item.unit }}</text>
            </view>
            <u-icon name="shopping-cart" color="#667eea" size="24" @click.stop="addToCartQuick(item)"></u-icon>
          </view>
          <text class="sales">已售 {{ item.sales_count || 0 }}+</text>
        </view>
      </view>
    </view>
    
    <view class="empty-state" v-else>
      <u-empty mode="data" text="暂无商品" icon="/static/empty-cart.png"></u-empty>
    </view>

    <!-- 悬浮购物车 -->
    <view class="float-cart" @click="goToCart">
      <u-icon name="shopping-cart-fill" color="#fff" size="28"></u-icon>
      <view class="badge" v-if="cartCount > 0">{{ cartCount }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getProductList, addToCart } from '@/api/product'
import type { Product } from '@/api/product'

const currentLocation = ref('桃源村')
const keyword = ref('')
const productList = ref<Product[]>([])
const isLoading = ref(true)
const currentFilter = ref('all')
const cartCount = ref(0)

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

// 模拟分类数据（带背景色）
const categoryList = ref([
  { name: '蔬菜水果', icon: '🥦', color: '#e8f5e9' },
  { name: '粮油米面', icon: '🌾', color: '#fff3e0' },
  { name: '禽蛋肉类', icon: '🥚', color: '#ffebee' },
  { name: '土特产', icon: '🎋', color: '#e0f2f1' },
  { name: '茶叶饮品', icon: '🍵', color: '#f1f8e9' },
  { name: '中药材', icon: '🌿', color: '#f9fbe7' },
  { name: '手工制品', icon: '🧶', color: '#f3e5f5' },
  { name: '乡村游', icon: '🏞️', color: '#e3f2fd' },
  { name: '认养农业', icon: '🐖', color: '#fff8e1' },
  { name: '全部分类', icon: '📦', color: '#f5f5f5' }
])

const loadProducts = async () => {
  isLoading.value = true
  try {
    const res = await getProductList({ keyword: keyword.value })
    // 模拟网络延迟以展示骨架屏
    setTimeout(() => {
      if (res) {
        productList.value = res
      }
      isLoading.value = false
    }, 800)
  } catch (e) {
    console.error('Failed to load products:', e)
    isLoading.value = false
  }
}

const onLocationClick = () => {
  // 点击直接触发重新定位
  initLocation()
}

const onSearch = () => {
  loadProducts()
}

const switchFilter = (type: string) => {
  if (currentFilter.value === type) return
  currentFilter.value = type
  loadProducts()
}

const onCategoryClick = (item: any) => {
  uni.showToast({
    title: `浏览${item.name}`,
    icon: 'none'
  })
}

const goToDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/shop/detail?id=${id}`
  })
}

const goToLive = () => uni.navigateTo({ url: '/pages/live/index' })
const goToDiscount = () => uni.showToast({ title: '特惠活动即将开启', icon: 'none' })
const goToNew = () => uni.showToast({ title: '新品即将上架', icon: 'none' })
const goToCart = () => uni.navigateTo({ url: '/pages/shop/cart' })

const addToCartQuick = async (item: Product) => {
  try {
    await addToCart(item.id, 1)
    cartCount.value++
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  } catch (e) {
    uni.showToast({ title: '添加失败', icon: 'none' })
  }
}

const initLocation = () => {
  currentLocation.value = '定位中...'
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      console.log('当前位置：', res.latitude, res.longitude)
      // 模拟逆地理编码逻辑：优先定位到建筑，其次是村庄
      // 真实开发需调用腾讯地图/高德地图 API 的逆地理编码接口
      // const address = await reverseGeocoder(res.latitude, res.longitude)
      
      // 模拟数据池
      const buildings = ['村委会', '便民超市', '卫生室', '农机站', '文化广场']
      const villages = ['桃源村', '李家庄', '杏花岭', '大王庄', '幸福里']
      
      // 模拟定位结果：70%概率定位到具体建筑，30%概率定位到村庄
      const isBuilding = Math.random() > 0.3
      let locationName = ''
      
      if (isBuilding) {
        const randomBuilding = buildings[Math.floor(Math.random() * buildings.length)]
        locationName = randomBuilding
      } else {
        const randomVillage = villages[Math.floor(Math.random() * villages.length)]
        locationName = randomVillage
      }
      
      currentLocation.value = locationName
      uni.showToast({
        title: `已定位到${locationName}`,
        icon: 'none'
      })
      
      // 定位成功后刷新商品列表
      loadProducts()
    },
    fail: (err) => {
      console.error('定位失败', err)
      currentLocation.value = '定位失败'
      
      // 判断是否为权限被拒绝 (err.errMsg 包含 "auth deny" 或 "authorize:fail")
      if (err.errMsg.indexOf('auth deny') !== -1 || err.errMsg.indexOf('authorize:fail') !== -1) {
        uni.showModal({
          title: '定位权限未开启',
          content: '请在设置中开启位置信息权限，以便为您提供周边服务',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting({
                success: (settingRes) => {
                  if (settingRes.authSetting['scope.userLocation']) {
                    // 用户打开设置并开启了权限，重新定位
                    initLocation()
                  }
                }
              })
            }
          }
        })
      } else {
        uni.showToast({
          title: '定位失败，请检查网络或GPS',
          icon: 'none'
        })
      }
    }
  })
}

onLoad(() => {
  initLocation()
  loadProducts()
})

onShow(() => {
  // 可以在这里刷新购物车数量
  // cartCount.value = ...
})
</script>

<style lang="scss" scoped>
.shop-container {
  padding: 20rpx;
  background-color: #f7f8fa;
  min-height: 100vh;
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
  margin: -20rpx -20rpx 20rpx -20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.02);
  
  .location-bar {
    display: flex;
    align-items: center;
    margin-right: 20rpx;
    
    .location-text {
      font-size: 28rpx;
      color: #333;
      font-weight: bold;
      margin: 0 6rpx;
    }
  }
  
  .search-box {
    flex: 1;
    
    .custom-search-bar {
      display: flex;
      align-items: center;
      background-color: #f5f5f5;
      height: 72rpx;
      border-radius: 36rpx;
      padding: 0 24rpx;
      
      .search-input {
        flex: 1;
        height: 100%;
        margin: 0 16rpx;
        font-size: 28rpx;
        color: #333;
      }
      
      .placeholder-style {
        color: #999;
      }
      
      .search-action {
        display: flex;
        align-items: center;
        
        .divider {
          width: 2rpx;
          height: 28rpx;
          background-color: #ddd;
          margin-right: 20rpx;
        }
        
        .search-text {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
        }
      }
    }
  }
}

.banner-section {
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 16rpx rgba(0,0,0,0.05);
  border-radius: 12rpx;
}

.category-section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx 0 10rpx 0;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.03);

  .category-grid {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    
    .category-item {
      width: 20%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 30rpx;
      flex-shrink: 0;
    }
  }
  
  .category-icon-wrapper {
    width: 88rpx;
    height: 88rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12rpx;
    
    .category-emoji {
      font-size: 44rpx;
    }
  }
  
  .category-text {
    font-size: 24rpx;
    color: #333;
    font-weight: 500;
  }
}

.marketing-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
  height: 340rpx;
  
  .marketing-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    position: relative;
    overflow: hidden;
    
    .card-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
      display: block;
      margin-bottom: 6rpx;
    }
    
    .card-subtitle {
      font-size: 22rpx;
      color: #999;
    }
  }
  
  .left {
    width: 48%;
    background: linear-gradient(135deg, #fff 0%, #fef6f6 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    .live-tag {
      display: inline-flex;
      align-items: center;
      background: rgba(255, 77, 79, 0.1);
      padding: 4rpx 12rpx;
      border-radius: 20rpx;
      margin-top: 10rpx;
      
      .dot {
        width: 10rpx;
        height: 10rpx;
        background: #ff4d4f;
        border-radius: 50%;
        margin-right: 8rpx;
        animation: pulse 1.5s infinite;
      }
      
      text {
        color: #ff4d4f;
        font-size: 20rpx;
        font-weight: bold;
      }
    }
    
    .card-img {
      width: 100%;
      height: 160rpx;
      align-self: center;
    }
  }
  
  .marketing-right {
    width: 48%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    .right-top, .right-bottom {
      height: 160rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .right-top { background: linear-gradient(135deg, #fff 0%, #fffbf0 100%); }
    .right-bottom { background: linear-gradient(135deg, #fff 0%, #f0f9ff 100%); }
    
    .card-img-sm {
      width: 100rpx;
      height: 100rpx;
    }
  }
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  
  .title-wrapper {
    .section-title {
      font-size: 34rpx;
      font-weight: bold;
      color: #333;
      margin-right: 12rpx;
    }
    .section-subtitle {
      font-size: 22rpx;
      color: #999;
      border-left: 1px solid #ddd;
      padding-left: 12rpx;
    }
  }
  
  .filter-tabs {
    display: flex;
    
    .filter-item {
      font-size: 24rpx;
      color: #666;
      margin-left: 24rpx;
      
      &.active {
        color: #667eea;
        font-weight: bold;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -6rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 20rpx;
          height: 4rpx;
          background: #667eea;
          border-radius: 2rpx;
        }
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
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.03);
  transition: all 0.2s;
  
  &:active {
    transform: scale(0.98);
  }
  
  .image-wrapper {
    position: relative;
    width: 100%;
    height: 340rpx;
    background: #f5f5f5;
    
    .product-img {
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    image[src] {
      opacity: 1;
    }
    
    .village-tag {
      position: absolute;
      bottom: 16rpx;
      left: 16rpx;
      background-color: rgba(0,0,0,0.6);
      color: #fff;
      font-size: 20rpx;
      padding: 6rpx 16rpx;
      border-radius: 30rpx;
      backdrop-filter: blur(4rpx);
      display: flex;
      align-items: center;
      gap: 4rpx;
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
      margin-bottom: 10rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .tags-row {
      display: flex;
      gap: 8rpx;
      margin-bottom: 16rpx;
      
      .tag {
        font-size: 18rpx;
        padding: 2rpx 8rpx;
        border-radius: 6rpx;
        
        &.red { color: #ff4d4f; border: 1px solid rgba(255,77,79,0.3); }
        &.green { color: #52c41a; border: 1px solid rgba(82,196,26,0.3); }
      }
    }
    
    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8rpx;
      
      .price-box {
        color: #ff4d4f;
        display: flex;
        align-items: baseline;
        
        .currency {
          font-size: 24rpx;
          margin-right: 2rpx;
          font-weight: bold;
        }
        
        .price {
          font-size: 36rpx;
          font-weight: bold;
        }
        
        .unit {
          font-size: 22rpx;
          color: #999;
          margin-left: 2rpx;
        }
      }
    }
    
    .sales {
      font-size: 20rpx;
      color: #bbb;
    }
  }
}

.skeleton {
  .skeleton-img {
    width: 100%;
    height: 340rpx;
    background: #f0f0f0;
    animation: skeleton-blink 1.5s infinite;
  }
  
  .skeleton-info {
    padding: 20rpx;
    
    .skeleton-line {
      height: 24rpx;
      background: #f0f0f0;
      margin-bottom: 16rpx;
      border-radius: 4rpx;
      animation: skeleton-blink 1.5s infinite;
      
      &.title { width: 80%; height: 32rpx; }
      &.desc { width: 60%; }
      &.price { width: 40%; margin-top: 20rpx; }
    }
  }
}

@keyframes skeleton-blink {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.float-cart {
  position: fixed;
  right: 30rpx;
  bottom: 140rpx; // 避开 tabbar
  width: 90rpx;
  height: 90rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 20rpx rgba(102, 126, 234, 0.4);
  z-index: 99;
  transition: transform 0.2s;
  
  &:active {
    transform: scale(0.9);
  }
  
  .badge {
    position: absolute;
    top: -6rpx;
    right: -6rpx;
    background: #ff4d4f;
    color: #fff;
    font-size: 20rpx;
    padding: 2rpx 10rpx;
    border-radius: 20rpx;
    border: 2rpx solid #fff;
  }
}

.empty-state {
  margin-top: 100rpx;
}
</style>
