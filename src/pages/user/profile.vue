<template>
  <view class="profile-container">
    <!-- 游客端视图 -->
    <view v-if="!isFarmerMode" class="visitor-view">
      <!-- 用户信息卡片 -->
      <view class="user-card visitor-card">
        <view class="user-content">
          <view class="avatar-wrapper" @click="goToUserInfo">
            <image :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" class="avatar"></image>
            <view class="vip-tag">Lv.1</view>
          </view>
          <view class="user-info">
            <text class="nickname">{{ userInfo.nickname || userInfo.username || '未设置昵称' }}</text>
            <text class="phone">{{ userInfo.phone || '未绑定手机' }}</text>
          </view>
          <view class="action-buttons">
            <view class="switch-role-btn" @click="switchRole" v-if="userInfo.role !== 'farmer'">
              <u-icon name="grid-fill" size="24" color="#fff"></u-icon>
              <text>切换农户</text>
            </view>
            <view class="settings-btn" @click="goToSettings">
              <u-icon name="setting" size="24" color="#fff"></u-icon>
            </view>
          </view>
        </view>
        
        <view class="stats-row">
          <view class="stat-item">
            <text class="stat-value">0</text>
            <text class="stat-label">收藏</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">0</text>
            <text class="stat-label">关注</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">0</text>
            <text class="stat-label">足迹</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">0</text>
            <text class="stat-label">积分</text>
          </view>
        </view>
      </view>

      <!-- 订单状态栏 -->
      <view class="order-section">
        <view class="order-grid">
          <view class="order-item" @click="goToOrders(1)">
            <view class="icon-wrapper">
              <u-icon name="rmb-circle" size="32" color="#666"></u-icon>
              <view class="badge" v-if="orderCounts.unpaid > 0">{{ orderCounts.unpaid }}</view>
            </view>
            <text class="order-text">待付款</text>
          </view>
          <view class="order-item" @click="goToOrders(2)">
            <view class="icon-wrapper">
              <u-icon name="car" size="32" color="#666"></u-icon>
              <view class="badge" v-if="orderCounts.unshipped > 0">{{ orderCounts.unshipped }}</view>
            </view>
            <text class="order-text">待发货</text>
          </view>
          <view class="order-item" @click="goToOrders(3)">
            <view class="icon-wrapper">
              <u-icon name="gift" size="32" color="#666"></u-icon>
              <view class="badge" v-if="orderCounts.unreceived > 0">{{ orderCounts.unreceived }}</view>
            </view>
            <text class="order-text">待收货</text>
          </view>
          <view class="order-item" @click="goToOrders(5)">
            <view class="icon-wrapper">
              <u-icon name="rmb" size="32" color="#666"></u-icon>
              <view class="badge" v-if="orderCounts.aftersale > 0">{{ orderCounts.aftersale }}</view>
            </view>
            <text class="order-text">退换/售后</text>
          </view>
          <view class="order-item" @click="goToOrders(0)">
            <u-icon name="arrow-right-circle" size="32" color="#666"></u-icon>
            <text class="order-text">全部</text>
          </view>
        </view>
      </view>

      <!-- 猜你喜欢（推荐商品与直播） -->
      <view class="recommend-section">
        <view class="section-title">
          <text class="title-text">猜你喜欢</text>
          <text class="subtitle-text">根据您的喜好推荐</text>
        </view>
        
        <view class="recommend-list">
          <!-- 模拟直播卡片 -->
          <view class="recommend-item live-card" @click="goToLiveRoom">
            <view class="image-wrapper">
              <image src="/static/default-live.png" mode="aspectFill" class="cover-img"></image>
              <view class="live-tag">
                <view class="dot"></view>
                <text>直播中</text>
              </view>
              <view class="viewer-count">1.2w观看</view>
            </view>
            <view class="info">
              <text class="name">桃源村春茶上新直播</text>
              <text class="desc">村长带你逛茶园，限时特惠</text>
            </view>
          </view>
          
          <!-- 模拟商品卡片 -->
          <view class="recommend-item product-card" v-for="i in 3" :key="i" @click="goToProductDetail">
            <view class="image-wrapper">
              <image src="/static/default-product.png" mode="aspectFill" class="cover-img"></image>
            </view>
            <view class="info">
              <text class="name">高山有机绿茶 2024新茶</text>
              <view class="price-row">
                <text class="price">¥128</text>
                <text class="sales">已售500+</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 退出登录按钮 -->
      <view class="logout-btn">
        <u-button type="error" text="退出登录" shape="circle" @click="handleLogout"></u-button>
      </view>
    </view>

    <!-- 农户端视图 -->
    <view v-else class="farmer-view">
      <!-- 用户信息卡片 -->
      <view class="user-card farmer-card">
        <view class="user-content">
          <view class="avatar-wrapper">
            <image :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" class="avatar"></image>
            <view class="vip-tag">农户</view>
          </view>
          <view class="user-info">
            <text class="nickname">{{ userInfo.nickname || '未设置昵称' }}</text>
            <text class="role-tag">已认证农户</text>
          </view>
          <view class="action-buttons">
            <view class="switch-role-btn" @click="switchBack">
              <u-icon name="arrow-left" size="24" color="#fff"></u-icon>
              <text>返回游客</text>
            </view>
            <view class="settings-btn" @click="goToSettings">
              <u-icon name="setting" size="24" color="#fff"></u-icon>
            </view>
          </view>
        </view>
        
        <!-- 天气信息 -->
        <view class="stats-row">
          <view class="stat-item">
            <text class="stat-value">26°C</text>
            <text class="stat-label">今日气温</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">65%</text>
            <text class="stat-label">空气湿度</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">良</text>
            <text class="stat-label">土壤墒情</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">优</text>
            <text class="stat-label">空气质量</text>
          </view>
        </view>
      </view>

      <!-- 快捷入口 -->
      <view class="quick-section">
        <view class="section-header">
          <text class="section-title">常用功能</text>
          <view class="more-link" @click="showAllFunctions">
            <text>全部功能</text>
            <u-icon name="arrow-right" size="12" color="#999"></u-icon>
          </view>
        </view>
        
        <view class="quick-grid">
          <view class="quick-item" @click="navigateTo('product/add')">
            <view class="icon-wrapper">
              <u-icon name="plus-circle" size="32" color="#4caf50"></u-icon>
            </view>
            <text class="quick-text">商品发布</text>
          </view>
          <view class="quick-item" @click="navigateTo('order/list')">
            <view class="icon-wrapper">
              <u-icon name="order" size="32" color="#4caf50"></u-icon>
              <view class="badge" v-if="pendingOrders > 0">{{ pendingOrders }}</view>
            </view>
            <text class="quick-text">订单处理</text>
          </view>
          <view class="quick-item" @click="navigateTo('land/monitor')">
            <view class="icon-wrapper">
              <u-icon name="dashboard" size="32" color="#4caf50"></u-icon>
            </view>
            <text class="quick-text">环境监测</text>
          </view>
          <view class="quick-item" @click="navigateTo('ai/disease')">
            <view class="icon-wrapper">
              <u-icon name="scan" size="32" color="#4caf50"></u-icon>
            </view>
            <text class="quick-text">病虫害识别</text>
          </view>
          <view class="quick-item" @click="navigateTo('data/sales')">
            <view class="icon-wrapper">
              <u-icon name="trending-up" size="32" color="#4caf50"></u-icon>
            </view>
            <text class="quick-text">销售统计</text>
          </view>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="menu-section">
        <!-- 我的土地 -->
        <view class="menu-group">
          <view class="group-title">我的土地</view>
          <u-cell-group :border="false">
            <u-cell icon="map" title="土地档案" :isLink="true" @click="navigateTo('land/list')" :border="false"></u-cell>
            <u-cell icon="edit-pen" title="农事记录" :isLink="true" @click="navigateTo('land/record')" :border="false"></u-cell>
            <u-cell icon="wifi" title="IoT设备管理" :isLink="true" @click="navigateTo('land/iot')" :border="false"></u-cell>
          </u-cell-group>
        </view>

        <!-- 农产品管理 -->
        <view class="menu-group">
          <view class="group-title">农产品管理</view>
          <u-cell-group :border="false">
            <u-cell icon="list" title="商品管理" :isLink="true" @click="navigateTo('product/list')" :border="false"></u-cell>
            <u-cell icon="car" title="物流管理" :isLink="true" @click="navigateTo('order/logistics')" :border="false"></u-cell>
            <u-cell icon="rmb-circle" title="售后管理" :isLink="true" @click="navigateTo('order/aftersale')" :border="false"></u-cell>
          </u-cell-group>
        </view>
        
        <!-- AI农技助手 -->
        <view class="menu-group">
          <view class="group-title">AI农技助手</view>
          <u-cell-group :border="false">
            <u-cell icon="kefu-ermai" title="智能问答" :isLink="true" @click="navigateTo('ai/qa')" :border="false"></u-cell>
            <u-cell icon="hourglass" title="市场行情" :isLink="true" @click="navigateTo('ai/market')" :border="false"></u-cell>
            <u-cell icon="calendar" title="种植方案" :isLink="true" @click="navigateTo('ai/plan')" :border="false"></u-cell>
          </u-cell-group>
        </view>
        
        <!-- 生活服务 (跳转回游客模式) -->
        <view class="menu-group">
          <view class="group-title">生活服务</view>
          <u-cell-group :border="false">
            <u-cell icon="shopping-cart" title="商城购物" :isLink="true" @click="navigateToVisitor('shop')" :border="false"></u-cell>
            <u-cell icon="play-circle" title="观看直播" :isLink="true" @click="navigateToVisitor('live')" :border="false"></u-cell>
            <u-cell icon="book" title="在线培训" :isLink="true" @click="navigateToVisitor('course')" :border="false"></u-cell>
            <u-cell icon="account" title="个人中心" :isLink="true" @click="switchBack" :border="false"></u-cell>
          </u-cell-group>
        </view>
      </view>
      
      <!-- 底部占位 -->
      <view class="bottom-spacer"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { storage } from '@/utils/storage'

const userInfo = ref<any>({})
const isAdmin = ref(false)
const isFarmerMode = ref(false)
const pendingOrders = ref(3)

const orderCounts = ref({
  unpaid: 0,
  unshipped: 0,
  unreceived: 0,
  uncomment: 0,
  aftersale: 0
})

onLoad(() => {
  // 获取用户信息
  const user = storage.get('user_info')
  if (user) {
    userInfo.value = user
    // 判断是否管理员
    isAdmin.value = user.role === 'admin'
    // 恢复农户模式状态
    const savedMode = storage.get('is_farmer_mode')
    if (savedMode && user.role === 'farmer') {
      isFarmerMode.value = true
    }
    
    // 模拟获取订单数量
    // 真实场景应调用 API: const counts = await getOrderCounts()
    orderCounts.value = {
        unpaid: 1,      // 待付款
        unshipped: 0,   // 待发货
        unreceived: 2,  // 待收货
        uncomment: 0,   // 待评价 (已移除界面显示，但数据结构保留以免报错)
        aftersale: 3    // 退换/售后
      }
  } else {
    // ...
  }
})

const goToUserInfo = () => {
  uni.navigateTo({ url: '/pages/user/info' })
}

const goToOrders = (type: number) => {
  // type: 0=全部, 1=待付款, 2=待发货, 3=待收货, 4=已完成
  uni.navigateTo({ url: `/pages/shop/order?status=${type}` })
}

const goToAddress = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const contactSupport = () => {
  uni.showToast({ title: '客服热线: 400-123-4567', icon: 'none' })
}

const goToHelp = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToAdmin = () => {
  uni.navigateTo({ url: '/pages/admin/dashboard' })
}

const goToSettings = () => {
  uni.showToast({ title: '设置功能开发中', icon: 'none' })
}

const goToLiveRoom = () => {
  uni.navigateTo({ url: '/pages/live/room?id=1' })
}

const goToProductDetail = () => {
  uni.navigateTo({ url: '/pages/shop/detail?id=1' })
}

const switchRole = () => {
  uni.showModal({
    title: '切换身份',
    content: '是否切换到农户端工作台？',
    success: (res) => {
      if (res.confirm) {
        isFarmerMode.value = true
        // 确保角色也被设置为 farmer (如果尚未设置)
        if (userInfo.value.role !== 'farmer') {
          userInfo.value.role = 'farmer'
          storage.set('user_info', userInfo.value)
        }
        storage.set('is_farmer_mode', true)
        uni.setNavigationBarTitle({ title: '农户工作台' })
        uni.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#4caf50'
        })
      }
    }
  })
}

const switchBack = () => {
  isFarmerMode.value = false
  storage.set('is_farmer_mode', false)
  uni.setNavigationBarTitle({ title: '个人中心' })
  uni.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: '#667eea'
  })
}

const navigateTo = (path: string) => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const navigateToVisitor = (type: string) => {
  switch (type) {
    case 'shop':
      uni.switchTab({ url: '/pages/shop/index' })
      break
    case 'live':
      uni.switchTab({ url: '/pages/live/index' })
      break
    case 'course':
      uni.switchTab({ url: '/pages/course/index' })
      break
  }
}

const showAllFunctions = () => {
  uni.showToast({ title: '展开所有功能', icon: 'none' })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        storage.clear()
        uni.reLaunch({ url: '/pages/user/login' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.profile-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 40rpx;
}

.user-card {
  &.visitor-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  &.farmer-card {
    background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
  }
  
  padding: 40rpx 30rpx 60rpx;
  position: relative;
  border-radius: 0 0 40rpx 40rpx;
  
  .user-content {
    display: flex;
    align-items: center;
    margin-bottom: 50rpx;
    padding-top: 20rpx;
    
    .avatar-wrapper {
      position: relative;
      margin-right: 30rpx;
      
      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 60rpx;
        border: 4rpx solid rgba(255,255,255,0.3);
      }
      
      .vip-tag {
        position: absolute;
        bottom: 0;
        right: -10rpx;
        background: #FFD700;
        color: #333;
        font-size: 20rpx;
        padding: 2rpx 10rpx;
        border-radius: 20rpx;
        font-weight: bold;
        border: 2rpx solid #fff;
      }
    }
    
    .user-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      
      .nickname {
        font-size: 36rpx;
        color: #fff;
        font-weight: bold;
        margin-bottom: 8rpx;
      }
      
      .phone {
        font-size: 24rpx;
        color: rgba(255,255,255,0.8);
      }
      
      .role-tag {
        font-size: 24rpx;
        color: rgba(255,255,255,0.9);
        background: rgba(0,0,0,0.1);
        padding: 4rpx 12rpx;
        border-radius: 8rpx;
        align-self: flex-start;
      }
    }
    
    .action-buttons {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 20rpx;
      
      .switch-role-btn {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.2);
        padding: 8rpx 16rpx;
        border-radius: 30rpx;
        
        text {
          color: #fff;
          font-size: 24rpx;
          margin-left: 6rpx;
        }
      }
      
      .settings-btn {
        padding: 10rpx;
      }
    }
  }
  
  .stats-row {
    display: flex;
    justify-content: space-around;
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .stat-value {
        font-size: 36rpx;
        color: #fff;
        font-weight: bold;
        margin-bottom: 6rpx;
      }
      
      .stat-label {
        font-size: 24rpx;
        color: rgba(255,255,255,0.8);
      }
    }
  }
}

.order-section {
  background: #fff;
  border-radius: 20rpx;
  margin: -40rpx 20rpx 20rpx;
  padding: 30rpx;
  position: relative;
  z-index: 1;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.02);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .section-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }
    
    .more-link {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #999;
      gap: 4rpx;
    }
  }
  
  .order-grid {
    display: flex;
    justify-content: space-between;
    padding: 10rpx 0;
    
    .order-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;
      position: relative;
      
      .icon-wrapper {
        position: relative;
        
        .badge {
          position: absolute;
          top: -10rpx;
          right: -10rpx;
          background-color: #ff4d4f;
          color: #fff;
          font-size: 20rpx;
          padding: 2rpx 8rpx;
          border-radius: 20rpx;
          border: 2rpx solid #fff;
        }
      }
      
      .order-text {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

.recommend-section {
  padding: 0 20rpx;
  
  .section-title {
    display: flex;
    align-items: baseline;
    margin-bottom: 24rpx;
    padding: 0 10rpx;
    
    .title-text {
      font-size: 34rpx;
      font-weight: bold;
      color: #333;
      margin-right: 12rpx;
    }
    
    .subtitle-text {
      font-size: 22rpx;
      color: #999;
    }
  }
  
  .recommend-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    
    .recommend-item {
      width: 48%;
      background: #fff;
      border-radius: 16rpx;
      margin-bottom: 20rpx;
      overflow: hidden;
      box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.02);
      
      .image-wrapper {
        position: relative;
        width: 100%;
        height: 260rpx;
        background: #f5f5f5;
        
        .cover-img {
          width: 100%;
          height: 100%;
        }
        
        .live-tag {
          position: absolute;
          top: 12rpx;
          left: 12rpx;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          padding: 4rpx 12rpx;
          border-radius: 20rpx;
          
          .dot {
            width: 8rpx;
            height: 8rpx;
            background: #ff4d4f;
            border-radius: 50%;
            margin-right: 6rpx;
          }
          
          text {
            color: #fff;
            font-size: 20rpx;
          }
        }
        
        .viewer-count {
          position: absolute;
          bottom: 12rpx;
          left: 12rpx;
          color: #fff;
          font-size: 20rpx;
          text-shadow: 0 1rpx 2rpx rgba(0,0,0,0.5);
        }
      }
      
      .info {
        padding: 16rpx;
        
        .name {
          font-size: 26rpx;
          color: #333;
          font-weight: bold;
          margin-bottom: 8rpx;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        
        .desc {
          font-size: 22rpx;
          color: #999;
        }
        
        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12rpx;
          
          .price {
            color: #ff4d4f;
            font-size: 30rpx;
            font-weight: bold;
          }
          
          .sales {
            font-size: 20rpx;
            color: #999;
          }
        }
      }
    }
  }
}

.quick-section {
  background: #fff;
  border-radius: 20rpx;
  margin: -40rpx 20rpx 20rpx;
  padding: 30rpx;
  position: relative;
  z-index: 1;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.02);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .section-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }
    
    .more-link {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #999;
      gap: 4rpx;
    }
  }
  
  .quick-grid {
    display: flex;
    justify-content: space-between;
    padding: 10rpx 0;
    
    .quick-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;
      position: relative;
      
      .icon-wrapper {
        position: relative;
        
        .badge {
          position: absolute;
          top: -10rpx;
          right: -10rpx;
          background-color: #ff4d4f;
          color: #fff;
          font-size: 20rpx;
          padding: 2rpx 8rpx;
          border-radius: 20rpx;
          border: 2rpx solid #fff;
        }
      }
      
      .quick-text {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

.menu-section {
  padding: 0 20rpx;
  
  .menu-group {
    background: #fff;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.01);
    
    .group-title {
      padding: 20rpx 30rpx 10rpx;
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      border-left: 8rpx solid #4caf50;
      margin: 20rpx 0 10rpx 20rpx;
    }
  }
}

.bottom-spacer {
  height: 40rpx;
}

.logout-btn {
  margin: 60rpx 40rpx;
}
</style>
