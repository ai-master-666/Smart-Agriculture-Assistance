<template>
  <view class="village-container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <u-icon name="arrow-left" size="28" color="#333"></u-icon>
      </view>
      <text class="title">村庄百科</text>
      <view class="placeholder"></view>
    </view>

    <!-- 村庄选择 -->
    <view class="village-selector">
      <u-picker 
        :show="showVillagePicker" 
        :columns="villageList" 
        @confirm="selectVillage" 
        @cancel="showVillagePicker = false"
      ></u-picker>
      <view class="select-btn" @click="showVillagePicker = true">
        <text>{{ currentVillage.name }}</text>
        <u-icon name="arrow-down" size="20" color="#666"></u-icon>
      </view>
    </view>

    <!-- 村庄概览 -->
    <view class="village-overview">
      <image :src="currentVillage.cover_image" mode="aspectFill" class="village-img"></image>
      <view class="village-info">
        <text class="village-name">{{ currentVillage.name }}</text>
        <text class="village-desc">{{ currentVillage.description }}</text>
        <view class="village-stats">
          <view class="stat-item">
            <u-icon name="users" size="20" color="#667eea"></u-icon>
            <text>{{ currentVillage.population }}人</text>
          </view>
          <view class="stat-item">
            <u-icon name="map" size="20" color="#667eea"></u-icon>
            <text>{{ currentVillage.area }}平方公里</text>
          </view>
          <view class="stat-item">
            <u-icon name="calendar" size="20" color="#667eea"></u-icon>
            <text>{{ currentVillage.established_year }}年建村</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 内容标签页 -->
    <view class="content-tabs">
      <u-tabs :list="contentTabs" :current="currentTab" @click="changeTab" lineColor="#667eea" activeColor="#667eea"></u-tabs>
    </view>

    <!-- 内容区域 -->
    <scroll-view scroll-y class="content-section">
      <!-- 村史文化 -->
      <view v-if="currentTab === 0" class="history-section">
        <view class="section-card">
          <text class="section-title">村史沿革</text>
          <text class="section-content">{{ currentVillage.history }}</text>
        </view>
        <view class="section-card">
          <text class="section-title">文化传统</text>
          <text class="section-content">{{ currentVillage.culture }}</text>
        </view>
        <view class="section-card">
          <text class="section-title">历史名人</text>
          <view class="celebrity-list">
            <view class="celebrity-item" v-for="(celebrity, index) in currentVillage.celebrities" :key="index">
              <image :src="celebrity.avatar" mode="aspectFill" class="celebrity-avatar"></image>
              <view class="celebrity-info">
                <text class="celebrity-name">{{ celebrity.name }}</text>
                <text class="celebrity-desc">{{ celebrity.description }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 特色产业 -->
      <view v-else-if="currentTab === 1" class="industry-section">
        <view class="section-card">
          <text class="section-title">主导产业</text>
          <text class="section-content">{{ currentVillage.industry }}</text>
        </view>
        <view class="section-card">
          <text class="section-title">特色产品</text>
          <view class="product-list">
            <view class="product-item" v-for="(product, index) in currentVillage.products" :key="index">
              <image :src="product.image" mode="aspectFill" class="product-image"></image>
              <text class="product-name">{{ product.name }}</text>
              <text class="product-desc">{{ product.description }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 风土人情 -->
      <view v-else-if="currentTab === 2" class="custom-section">
        <view class="section-card">
          <text class="section-title">风俗习惯</text>
          <text class="section-content">{{ currentVillage.customs }}</text>
        </view>
        <view class="section-card">
          <text class="section-title">传统节日</text>
          <view class="festival-list">
            <view class="festival-item" v-for="(festival, index) in currentVillage.festivals" :key="index">
              <text class="festival-name">{{ festival.name }}</text>
              <text class="festival-date">{{ festival.date }}</text>
              <text class="festival-desc">{{ festival.description }}</text>
            </view>
          </view>
        </view>
        <view class="section-card">
          <text class="section-title">特色美食</text>
          <view class="food-list">
            <view class="food-item" v-for="(food, index) in currentVillage.foods" :key="index">
              <image :src="food.image" mode="aspectFill" class="food-image"></image>
              <text class="food-name">{{ food.name }}</text>
              <text class="food-desc">{{ food.description }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 村庄选择
const showVillagePicker = ref(false)
const villageList = ref([
  '桃源村',
  '李家庄',
  '杏花岭',
  '大王庄'
])

// 当前村庄数据
const currentVillage = ref({
  name: '桃源村',
  description: '桃源村是一个历史悠久的古村落，以桃花闻名，每年春季桃花盛开时吸引大量游客前来观赏。',
  cover_image: 'https://cdn.uviewui.com/uview/album/1.jpg',
  population: 1200,
  area: 5.2,
  established_year: 1420,
  history: '桃源村始建于明朝永乐年间，因村里遍植桃树而得名。历史上曾是重要的商贸集散地，有"小南京"之称。',
  culture: '桃源村保留了丰富的传统文化，包括传统戏曲、民间工艺等。每年春节期间会举办盛大的庙会活动。',
  celebrities: [
    {
      name: '张三',
      avatar: '/static/default-avatar.png',
      description: '清代著名学者，著有《桃源文集》'
    },
    {
      name: '李四',
      avatar: '/static/default-avatar.png',
      description: '近代企业家，为家乡建设做出重要贡献'
    }
  ],
  industry: '桃源村以种植业为主，主要种植桃树、梨树等水果，同时发展乡村旅游产业。',
  products: [
    {
      name: '桃源蜜桃',
      image: 'https://cdn.uviewui.com/uview/album/2.jpg',
      description: '口感甜美，汁多味浓，是桃源村的特色产品'
    },
    {
      name: '桃木工艺品',
      image: 'https://cdn.uviewui.com/uview/album/3.jpg',
      description: '以当地桃木为原料制作的精美工艺品'
    }
  ],
  customs: '桃源村保留了许多传统习俗，如春节贴春联、元宵节闹花灯、端午节赛龙舟等。',
  festivals: [
    {
      name: '桃花节',
      date: '每年3月',
      description: '桃花盛开时举办的盛大节日，吸引大量游客'
    },
    {
      name: '丰收节',
      date: '每年9月',
      description: '庆祝丰收的传统节日，有各种民俗活动'
    }
  ],
  foods: [
    {
      name: '桃源八大碗',
      image: 'https://cdn.uviewui.com/uview/album/4.jpg',
      description: '当地传统美食，由八种特色菜肴组成'
    },
    {
      name: '桃花酒',
      image: 'https://cdn.uviewui.com/uview/album/5.jpg',
      description: '以桃花为原料酿制的特色美酒'
    }
  ]
})

// 内容标签
const contentTabs = [
  { name: '村史文化' },
  { name: '特色产业' },
  { name: '风土人情' }
]
const currentTab = ref(0)

// 方法
const selectVillage = (e: any) => {
  const villageName = e.value[0]
  currentVillage.value.name = villageName
  // 实际项目中这里应该根据村庄名称加载对应的村庄数据
  showVillagePicker.value = false
}

const changeTab = (item: any) => {
  currentTab.value = item.index
}

const goBack = () => {
  uni.navigateBack()
}

onLoad()
</script>

<style lang="scss" scoped>
.village-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 20rpx;
  background: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  
  .back-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
  
  .placeholder {
    width: 60rpx;
  }
}

.village-selector {
  background: #fff;
  padding: 20rpx;
  margin-bottom: 20rpx;
  
  .select-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #333;
  }
}

.village-overview {
  background: #fff;
  margin-bottom: 20rpx;
  overflow: hidden;
  
  .village-img {
    width: 100%;
    height: 320rpx;
    background: #eee;
  }
  
  .village-info {
    padding: 24rpx;
    
    .village-name {
      display: block;
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 12rpx;
    }
    
    .village-desc {
      font-size: 24rpx;
      color: #666;
      line-height: 1.4;
      margin-bottom: 20rpx;
    }
    
    .village-stats {
      display: flex;
      gap: 40rpx;
      
      .stat-item {
        display: flex;
        align-items: center;
        font-size: 22rpx;
        color: #666;
        
        text {
          margin-left: 8rpx;
        }
      }
    }
  }
}

.content-tabs {
  background: #fff;
  margin-bottom: 20rpx;
}

.content-section {
  padding: 0 20rpx 40rpx;
  min-height: calc(100vh - 500rpx);
  
  .section-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    
    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 16rpx;
      display: block;
    }
    
    .section-content {
      font-size: 24rpx;
      color: #666;
      line-height: 1.4;
    }
  }
  
  .celebrity-list {
    .celebrity-item {
      display: flex;
      margin-bottom: 20rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .celebrity-avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 40rpx;
        margin-right: 16rpx;
        background: #f0f0f0;
      }
      
      .celebrity-info {
        flex: 1;
        
        .celebrity-name {
          display: block;
          font-size: 24rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .celebrity-desc {
          font-size: 22rpx;
          color: #666;
          line-height: 1.4;
        }
      }
    }
  }
  
  .product-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    
    .product-item {
      width: 48%;
      background: #f9f9f9;
      border-radius: 12rpx;
      padding: 20rpx;
      
      .product-image {
        width: 100%;
        height: 160rpx;
        border-radius: 8rpx;
        margin-bottom: 12rpx;
        background: #eee;
      }
      
      .product-name {
        display: block;
        font-size: 24rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
      }
      
      .product-desc {
        font-size: 20rpx;
        color: #666;
        line-height: 1.3;
      }
    }
  }
  
  .festival-list {
    .festival-item {
      padding: 16rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .festival-name {
        display: block;
        font-size: 24rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 4rpx;
      }
      
      .festival-date {
        font-size: 20rpx;
        color: #999;
        margin-bottom: 8rpx;
      }
      
      .festival-desc {
        font-size: 22rpx;
        color: #666;
        line-height: 1.4;
      }
    }
  }
  
  .food-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    
    .food-item {
      width: 48%;
      background: #f9f9f9;
      border-radius: 12rpx;
      padding: 20rpx;
      
      .food-image {
        width: 100%;
        height: 160rpx;
        border-radius: 8rpx;
        margin-bottom: 12rpx;
        background: #eee;
      }
      
      .food-name {
        display: block;
        font-size: 24rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
      }
      
      .food-desc {
        font-size: 20rpx;
        color: #666;
        line-height: 1.3;
      }
    }
  }
}
</style>