<template>
  <view class="plan-container">
    <view class="banner-section">
      <image src="https://cdn.uviewui.com/uview/swiper/swiper2.png" mode="aspectFill" class="banner-img"></image>
      <view class="banner-mask">
        <text class="banner-title">您的专属乡村游攻略</text>
        <text class="banner-subtitle">AI 智能定制 · 深度体验乡村之美</text>
      </view>
    </view>

    <view class="plan-content">
      <!-- 路线概览 -->
      <view class="section-card">
        <view class="card-header">
          <u-icon name="map-fill" color="#667eea" size="20"></u-icon>
          <text class="title">路线概览</text>
        </view>
        <view class="route-timeline">
          <view class="timeline-item" v-for="(node, index) in planData.route" :key="index">
            <view class="time">{{ node.time }}</view>
            <view class="dot-line">
              <view class="dot"></view>
              <view class="line" v-if="index < planData.route.length - 1"></view>
            </view>
            <view class="content">
              <text class="node-title">{{ node.title }}</text>
              <text class="node-desc">{{ node.desc }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 食宿推荐 -->
      <view class="section-card">
        <view class="card-header">
          <u-icon name="home-fill" color="#ff9900" size="20"></u-icon>
          <text class="title">食宿推荐</text>
        </view>
        <view class="recommend-list">
          <view class="recommend-item" v-for="(item, index) in planData.accommodations" :key="index">
            <image :src="item.image" mode="aspectFill" class="item-img"></image>
            <view class="item-info">
              <text class="item-name">{{ item.name }}</text>
              <view class="tags">
                <text class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</text>
              </view>
              <text class="item-price">¥{{ item.price }}/晚</text>
            </view>
            <button class="book-btn" @click="bookHotel(item)">预订</button>
          </view>
        </view>
      </view>

      <!-- 预算预估 -->
      <view class="section-card">
        <view class="card-header">
          <u-icon name="rmb-circle-fill" color="#ff4d4f" size="20"></u-icon>
          <text class="title">预算预估</text>
        </view>
        <view class="budget-box">
          <view class="budget-row" v-for="(cost, index) in planData.budget" :key="index">
            <text class="label">{{ cost.label }}</text>
            <text class="value">¥{{ cost.amount }}</text>
          </view>
          <view class="divider"></view>
          <view class="budget-total">
            <text class="label">总计</text>
            <text class="value">¥{{ totalBudget }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="footer-bar">
      <button class="action-btn share" @click="sharePlan">分享给好友</button>
      <button class="action-btn save" @click="savePlan">保存到行程</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const planData = ref({
  route: [
    { time: '09:00', title: '抵达桃源村游客中心', desc: '领取导览图，存放大件行李' },
    { time: '09:30', title: '古村落漫步', desc: '参观明清古建筑群，体验非遗剪纸' },
    { time: '12:00', title: '农家特色午餐', desc: '品尝当地著名的柴火鸡和野菜' },
    { time: '14:00', title: '果园采摘体验', desc: '前往李家庄果园采摘当季水果' },
    { time: '16:30', title: '溪边露营下午茶', desc: '享受悠闲的午后时光' }
  ],
  accommodations: [
    { 
      name: '云栖民宿', 
      price: 288, 
      image: 'https://cdn.uviewui.com/uview/album/1.jpg',
      tags: ['山景房', '含早', '免费停车']
    },
    { 
      name: '竹林小院', 
      price: 198, 
      image: 'https://cdn.uviewui.com/uview/album/2.jpg',
      tags: ['独立卫浴', '可做饭']
    }
  ],
  budget: [
    { label: '交通费', amount: 50 },
    { label: '餐饮费', amount: 150 },
    { label: '门票/体验', amount: 80 },
    { label: '住宿费', amount: 288 }
  ]
})

const totalBudget = computed(() => {
  return planData.value.budget.reduce((acc, cur) => acc + cur.amount, 0)
})

onLoad((options: any) => {
  if (options.data) {
    // In real app, parse passed data or fetch by ID
    // planData.value = JSON.parse(decodeURIComponent(options.data))
  }
})

const bookHotel = (item: any) => {
  uni.showToast({ title: '跳转预订...', icon: 'none' })
  // uni.navigateTo({ url: '/pages/tour/booking' })
}

const sharePlan = () => {
  uni.showToast({ title: '分享图片生成中', icon: 'loading' })
}

const savePlan = () => {
  uni.showToast({ title: '已保存至我的行程', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.plan-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

.banner-section {
  position: relative;
  height: 400rpx;
  
  .banner-img {
    width: 100%;
    height: 100%;
  }
  
  .banner-mask {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 40rpx 30rpx;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    color: #fff;
    
    .banner-title {
      font-size: 40rpx;
      font-weight: bold;
      display: block;
      margin-bottom: 10rpx;
    }
    
    .banner-subtitle {
      font-size: 24rpx;
      opacity: 0.9;
    }
  }
}

.plan-content {
  padding: 30rpx;
  margin-top: -40rpx;
  position: relative;
  z-index: 1;
}

.section-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.02);
  
  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    border-bottom: 1rpx solid #f9f9f9;
    padding-bottom: 20rpx;
    
    .title {
      font-size: 32rpx;
      font-weight: bold;
      margin-left: 12rpx;
      color: #333;
    }
  }
}

.route-timeline {
  .timeline-item {
    display: flex;
    margin-bottom: 40rpx;
    
    &:last-child {
      margin-bottom: 0;
      .dot-line .line { display: none; }
    }
    
    .time {
      width: 100rpx;
      font-size: 26rpx;
      color: #333;
      font-weight: bold;
      text-align: right;
      margin-right: 20rpx;
    }
    
    .dot-line {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 20rpx;
      
      .dot {
        width: 16rpx;
        height: 16rpx;
        background: #667eea;
        border-radius: 50%;
        border: 4rpx solid #e0e7ff;
      }
      
      .line {
        width: 2rpx;
        flex: 1;
        background: #eee;
        margin-top: 8rpx;
        min-height: 60rpx;
      }
    }
    
    .content {
      flex: 1;
      background: #f9f9f9;
      padding: 20rpx;
      border-radius: 12rpx;
      
      .node-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        display: block;
        margin-bottom: 8rpx;
      }
      
      .node-desc {
        font-size: 24rpx;
        color: #666;
        line-height: 1.4;
      }
    }
  }
}

.recommend-list {
  .recommend-item {
    display: flex;
    margin-bottom: 30rpx;
    
    &:last-child { margin-bottom: 0; }
    
    .item-img {
      width: 160rpx;
      height: 160rpx;
      border-radius: 12rpx;
      margin-right: 20rpx;
    }
    
    .item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .item-name {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
      }
      
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8rpx;
        
        .tag {
          font-size: 20rpx;
          color: #666;
          background: #f0f0f0;
          padding: 4rpx 12rpx;
          border-radius: 4rpx;
        }
      }
      
      .item-price {
        font-size: 32rpx;
        color: #ff4d4f;
        font-weight: bold;
      }
    }
    
    .book-btn {
      align-self: center;
      font-size: 24rpx;
      background: #667eea;
      color: #fff;
      padding: 0 30rpx;
      height: 60rpx;
      line-height: 60rpx;
      border-radius: 30rpx;
    }
  }
}

.budget-box {
  .budget-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;
    font-size: 28rpx;
    color: #666;
  }
  
  .divider {
    height: 1rpx;
    background: #eee;
    margin: 20rpx 0;
  }
  
  .budget-total {
    display: flex;
    justify-content: space-between;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    
    .value {
      color: #ff4d4f;
    }
  }
}

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  box-sizing: border-box;
  z-index: 100;
  
  .action-btn {
    width: 48%;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    font-size: 30rpx;
    border: none;
    
    &.share {
      background: #e0e7ff;
      color: #667eea;
    }
    
    &.save {
      background: #667eea;
      color: #fff;
    }
    
    &::after { border: none; }
  }
}
</style>
