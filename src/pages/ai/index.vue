<template>
  <view class="ai-container">
    <view class="header-section">
      <text class="title">AI 村庄助手</text>
      <text class="subtitle">您的智能农业与旅游向导</text>
    </view>

    <view class="feature-grid">
      <view class="feature-card" @click="goToChat">
        <view class="icon-wrapper chat-icon">
          <u-icon name="chat-fill" size="32" color="#fff"></u-icon>
        </view>
        <text class="feature-title">智能问答</text>
        <text class="feature-desc">农业技术、村庄百科随心问</text>
      </view>

      <view class="feature-card" @click="goToDiagnose">
        <view class="icon-wrapper camera-icon">
          <u-icon name="camera-fill" size="32" color="#fff"></u-icon>
        </view>
        <text class="feature-title">拍照诊断</text>
        <text class="feature-desc">病虫害识别、作物健康分析</text>
      </view>

      <view class="feature-card" @click="showFeature('market')">
        <view class="icon-wrapper market-icon">
          <u-icon name="trending-up" size="32" color="#fff"></u-icon>
        </view>
        <text class="feature-title">行情分析</text>
        <text class="feature-desc">农产品价格趋势预测</text>
      </view>

      <view class="feature-card" @click="showFeature('guide')">
        <view class="icon-wrapper guide-icon">
          <u-icon name="map-fill" size="32" color="#fff"></u-icon>
        </view>
        <text class="feature-title">游玩攻略</text>
        <text class="feature-desc">个性化定制乡村游路线</text>
      </view>
    </view>

    <!-- 快捷提问 -->
    <view class="quick-ask">
      <text class="section-title">大家都在问</text>
      <view class="tags">
        <u-tag text="苹果树怎么修剪？" shape="circle" plain @click="quickAsk('苹果树怎么修剪？')"></u-tag>
        <u-tag text="最近村里有什么活动？" shape="circle" plain @click="quickAsk('最近村里有什么活动？')"></u-tag>
        <u-tag text="西红柿叶子发黄怎么办？" shape="circle" plain @click="quickAsk('西红柿叶子发黄怎么办？')"></u-tag>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const goToChat = () => {
  uni.navigateTo({ url: '/pages/ai/chat' })
}

const goToDiagnose = () => {
  uni.navigateTo({ url: '/pages/ai/diagnose' })
}

const showFeature = (type: string) => {
  uni.showToast({ title: '功能即将上线', icon: 'none' })
}

const quickAsk = (question: string) => {
  uni.navigateTo({ url: `/pages/ai/chat?q=${encodeURIComponent(question)}` })
}
</script>

<style lang="scss" scoped>
.ai-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 30rpx;
}

.header-section {
  margin-bottom: 40rpx;
  
  .title {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .subtitle {
    font-size: 28rpx;
    color: #666;
  }
}

.feature-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 40rpx;
  
  .feature-card {
    width: 48%;
    background: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
    
    .icon-wrapper {
      width: 80rpx;
      height: 80rpx;
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20rpx;
      
      &.chat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
      &.camera-icon { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }
      &.market-icon { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); }
      &.guide-icon { background: linear-gradient(135deg, #fccb90 0%, #d57eeb 100%); }
    }
    
    .feature-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      display: block;
      margin-bottom: 8rpx;
    }
    
    .feature-desc {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.quick-ask {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  
  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
  }
}
</style>
