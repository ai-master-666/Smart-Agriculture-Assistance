<template>
  <view class="room-container">
    <!-- 视频播放区域 -->
    <view class="video-section">
      <video 
        :src="liveUrl" 
        autoplay 
        loop 
        :muted="false"
        object-fit="cover"
        class="live-video"
        @error="onVideoError"
      ></video>
      
      <!-- 礼物动画 -->
      <view v-if="showGiftAnimation" class="gift-animation" :style="{ color: currentGift?.color }">
        <u-icon :name="currentGift?.icon" size="80"></u-icon>
        <text class="gift-name">{{ currentGift?.name }}</text>
      </view>
      
      <!-- 直播信息覆盖层 -->
      <view class="overlay-info">
        <view class="top-bar">
          <view class="host-info">
            <image :src="liveInfo.host_avatar || '/static/default-avatar.png'" mode="aspectFill" class="host-avatar"></image>
            <view class="host-detail">
                <text class="host-name">{{ liveInfo.host_name || '主播' }}</text>
                <text class="live-status-badge">直播中</text>
            </view>
            <view class="follow-btn" @click.stop="toggleFollow" v-if="!isFollowed">
                <text>关注</text>
            </view>
          </view>
          
          <view class="right-actions">
            <view class="viewer-count">
                <u-icon name="eye" size="14" color="#fff"></u-icon>
                <text>{{ viewerCount }}</text>
            </view>
            <view class="close-btn" @click="exitRoom">
                <u-icon name="close" size="18" color="#fff"></u-icon>
            </view>
          </view>
        </view>
        
        <view class="bottom-info">
           <text class="live-title">{{ liveInfo.title }}</text>
           <text class="live-desc" v-if="liveInfo.description">{{ liveInfo.description }}</text>
        </view>
      </view>
    </view>

    <!-- 弹幕区域 -->
    <scroll-view scroll-y class="danmu-container" :scroll-top="scrollTop" scroll-with-animation>
      <view class="danmu-item" v-for="(msg, index) in danmuList" :key="index">
        <text class="danmu-user">{{ msg.nickname }}:</text>
        <text class="danmu-content">{{ msg.content }}</text>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-toolbar">
      <view class="input-wrap">
        <input 
            v-model="inputValue"
            placeholder="说点什么..."
            class="chat-input"
            confirm-type="send"
            @confirm="sendDanmu"
        />
      </view>
      
      <view class="action-btn" @click="showGoods = true">
        <u-icon name="shopping-cart" size="28" color="#fff"></u-icon>
        <view class="badge" v-if="goodsList.length > 0">{{ goodsList.length }}</view>
      </view>
      
      <view class="action-btn" @click="showGift = true">
        <u-icon name="gift" size="28" color="#fff"></u-icon>
      </view>
      
      <view class="action-btn" @click="toggleLike">
        <u-icon :name="isLiked ? 'heart-fill' : 'heart'" size="28" :color="isLiked ? '#ff4d4f' : '#fff'"></u-icon>
      </view>
      
      <view class="action-btn" @click="showContributors = !showContributors">
        <u-icon name="ranking" size="28" color="#fff"></u-icon>
      </view>
      
      <view class="action-btn share-btn">
        <button open-type="share" class="share-trigger"></button>
        <u-icon name="share" size="28" color="#fff"></u-icon>
      </view>
    </view>
    
    <!-- 商品橱窗弹窗 -->
    <u-popup :show="showGoods" mode="bottom" @close="showGoods = false" :round="16">
        <view class="goods-popup">
            <view class="popup-header">
                <text class="title">直播好物 ({{ goodsList.length }})</text>
                <u-icon name="close" size="20" color="#999" @click="showGoods = false"></u-icon>
            </view>
            <scroll-view scroll-y class="goods-list">
                <view class="goods-item" v-for="(item, index) in goodsList" :key="index">
                    <image :src="item.image" mode="aspectFill" class="goods-img"></image>
                    <view class="goods-info">
                        <text class="goods-name">{{ item.name }}</text>
                        <view class="goods-bottom">
                            <text class="goods-price">¥{{ item.price }}</text>
                            <view class="buy-btn" @click="buyGood(item)">去购买</view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
    </u-popup>
    
    <!-- 礼物弹窗 -->
    <u-popup :show="showGift" mode="bottom" @close="showGift = false" :round="16">
        <view class="gift-popup">
            <view class="popup-header">
                <text class="title">送礼物</text>
                <u-icon name="close" size="20" color="#999" @click="showGift = false"></u-icon>
            </view>
            <view class="gift-grid">
                <view class="gift-item" v-for="(gift, index) in giftList" :key="index" @click="sendGift(gift)">
                    <view class="gift-icon-box">
                        <u-icon :name="gift.icon" :color="gift.color" size="40"></u-icon>
                    </view>
                    <text class="gift-name">{{ gift.name }}</text>
                    <text class="gift-price">{{ gift.price }}金豆</text>
                </view>
            </view>
        </view>
    </u-popup>
    
    <!-- 贡献榜弹窗 -->
    <u-popup :show="showContributors" mode="right" @close="showContributors = false" :round="16" :width="300">
        <view class="contributors-popup">
            <view class="popup-header">
                <text class="title">贡献榜</text>
                <u-icon name="close" size="20" color="#999" @click="showContributors = false"></u-icon>
            </view>
            <scroll-view scroll-y class="contributors-list">
                <view class="contributor-item" v-for="(item, index) in giftContributors" :key="index">
                    <view class="rank-number" :class="{ 'top-three': index < 3 }">
                        {{ index + 1 }}
                    </view>
                    <image :src="item.avatar" mode="aspectFill" class="contributor-avatar"></image>
                    <text class="contributor-name">{{ item.name }}</text>
                    <text class="contributor-amount">{{ item.amount }}金豆</text>
                </view>
                <view v-if="giftContributors.length === 0" class="empty-contributors">
                    <text>暂无贡献</text>
                </view>
            </scroll-view>
        </view>
    </u-popup>
    
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { getLiveDetail } from '@/api/live'
import type { LiveRoom } from '@/api/live'

const roomId = ref<number>(0)
const liveUrl = ref('http://vjs.zencdn.net/v/oceans.mp4') // Default demo video
const viewerCount = ref(0)
const inputValue = ref('')
const scrollTop = ref(0)
const liveInfo = ref<Partial<LiveRoom>>({})
const danmuList = ref<any[]>([])
const isFollowed = ref(false)
const isLiked = ref(false)
const showGoods = ref(false)
const showGift = ref(false)

// Mock Data
const goodsList = ref([
    { id: 1, name: '高山有机绿茶 2024新茶', price: '128.00', image: '/static/default-product.png' },
    { id: 2, name: '农家自制腊肉 500g', price: '58.00', image: '/static/default-product.png' },
    { id: 3, name: '新鲜土鸡蛋 30枚装', price: '39.90', image: '/static/default-product.png' },
    { id: 4, name: '野生蜂蜜 500g', price: '88.00', image: '/static/default-product.png' }
])

const giftList = ref([
    { id: 1, name: '鲜花', price: 10, icon: 'gift', color: '#ff4d4f' },
    { id: 2, name: '爱心', price: 50, icon: 'heart-fill', color: '#ff7875' },
    { id: 3, name: '拖拉机', price: 100, icon: 'car-fill', color: '#1890ff' },
    { id: 4, name: '火箭', price: 1000, icon: 'plane-fill', color: '#722ed1' },
    { id: 5, name: '金蛋', price: 20, icon: 'egg', color: '#ffc107' },
    { id: 6, name: '奖杯', price: 200, icon: 'trophy', color: '#ff9800' },
    { id: 7, name: '烟花', price: 500, icon: 'firework', color: '#e91e63' },
    { id: 8, name: '城堡', price: 2000, icon: 'home', color: '#9c27b0' }
])

let socketTask: any = null
let heartbeatInterval: any = null

onLoad((options: any) => {
  if (options.id) {
    roomId.value = parseInt(options.id)
    loadLiveInfo(roomId.value)
  }
})

// Share Config
onShareAppMessage(() => {
    return {
        title: liveInfo.value.title || '来看这个有趣的直播！',
        path: `/pages/live/room?id=${roomId.value}`,
        imageUrl: liveInfo.value.cover_image
    }
})

const loadLiveInfo = async (id: number) => {
    try {
        const res = await getLiveDetail(id)
        if (res) {
            liveInfo.value = res
            if (res.pull_url) {
                liveUrl.value = res.pull_url
            }
            viewerCount.value = res.viewer_count || 0
            
            // Connect to WebSocket
            connectSocket()
        }
    } catch (e) {
        console.error('Failed to load live info', e)
    }
}

const onVideoError = (e: any) => {
    console.error('Video error:', e)
    uni.showToast({ title: '视频加载失败', icon: 'none' })
}

const connectSocket = () => {
    // Mock WebSocket connection
    startMockDanmu()
}

const startMockDanmu = () => {
    heartbeatInterval = setInterval(() => {
        const mockDanmus = [
          { nickname: '用户A', content: '主播好！' },
          { nickname: '用户B', content: '这风景真不错' },
          { nickname: '用户C', content: '怎么购买？' },
          { nickname: '用户D', content: '点赞点赞' }
        ]
        const randomMsg = mockDanmus[Math.floor(Math.random() * mockDanmus.length)]
        danmuList.value.push(randomMsg)
        scrollToBottom()
    }, 3000)
}

const sendDanmu = () => {
  if (!inputValue.value.trim()) return
  
  const msg = {
    nickname: '我',
    content: inputValue.value
  }
  
  danmuList.value.push(msg)
  scrollToBottom()
  
  inputValue.value = ''
}

const scrollToBottom = () => {
    nextTick(() => {
        scrollTop.value = danmuList.value.length * 100 // Estimate height
    })
}

const toggleFollow = () => {
    isFollowed.value = !isFollowed.value
    uni.showToast({ title: isFollowed.value ? '关注成功' : '已取消关注', icon: 'none' })
}

const toggleLike = () => {
    isLiked.value = !isLiked.value
    if (isLiked.value) {
        uni.showToast({ title: '点赞成功', icon: 'none' })
        // Send like animation/message
    }
}

const buyGood = (item: any) => {
    showGoods.value = false
    uni.navigateTo({
        url: `/pages/shop/detail?id=${item.id}`,
        fail: () => {
            uni.showToast({ title: '跳转商品详情', icon: 'none' })
        }
    })
}

// 礼物动画相关
const showGiftAnimation = ref(false)
const currentGift = ref<any>(null)
const giftContributors = ref<any[]>([])
const showContributors = ref(false)

const sendGift = (gift: any) => {
    showGift.value = false
    uni.showToast({ title: `送出 ${gift.name}`, icon: 'success' })
    
    // 显示礼物动画
    showGiftAnimation.value = true
    currentGift.value = gift
    setTimeout(() => {
        showGiftAnimation.value = false
    }, 2000)
    
    // Add gift message to danmu
    danmuList.value.push({
        nickname: '系统',
        content: `我送出了 ${gift.name} x1`
    })
    
    // 更新贡献榜
    updateContributors(gift)
    
    scrollToBottom()
}

const updateContributors = (gift: any) => {
    const existingUser = giftContributors.value.find(item => item.name === '我')
    if (existingUser) {
        existingUser.amount += gift.price
    } else {
        giftContributors.value.push({
            name: '我',
            amount: gift.price,
            avatar: '/static/default-avatar.png'
        })
    }
    // 按贡献值排序
    giftContributors.value.sort((a, b) => b.amount - a.amount)
    // 只保留前5名
    if (giftContributors.value.length > 5) {
        giftContributors.value = giftContributors.value.slice(0, 5)
    }
}

const exitRoom = () => {
    uni.navigateBack()
}

onUnmounted(() => {
    if (socketTask) {
        socketTask.close()
    }
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval)
    }
})
</script>

<style lang="scss" scoped>
.room-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  position: relative;
}

.video-section {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  
  .live-video {
    width: 100%;
    height: 100%;
  }
  
  .overlay-info {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 120rpx; // Leave space for bottom bar
    padding: 40rpx 20rpx 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: none; 
    z-index: 2;
    
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      pointer-events: auto; // Allow clicks on top bar
      
      .host-info {
        display: flex;
        align-items: center;
        background: rgba(0,0,0,0.3);
        padding: 6rpx 6rpx 6rpx 6rpx;
        border-radius: 40rpx;
        backdrop-filter: blur(4px);
        
        .host-avatar {
          width: 64rpx;
          height: 64rpx;
          border-radius: 32rpx;
          margin-right: 12rpx;
          border: 2rpx solid #fff;
        }
        
        .host-detail {
            display: flex;
            flex-direction: column;
            margin-right: 16rpx;
            
            .host-name {
                font-size: 24rpx;
                color: #fff;
                font-weight: bold;
                max-width: 160rpx;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            
            .live-status-badge {
                font-size: 18rpx;
                color: #fff;
                opacity: 0.8;
            }
        }
        
        .follow-btn {
            background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
            padding: 8rpx 20rpx;
            border-radius: 24rpx;
            
            text {
                font-size: 20rpx;
                color: #fff;
                font-weight: bold;
            }
        }
      }
      
      .right-actions {
          display: flex;
          align-items: center;
          gap: 16rpx;
          
          .viewer-count {
            display: flex;
            align-items: center;
            background: rgba(0,0,0,0.3);
            padding: 8rpx 16rpx;
            border-radius: 24rpx;
            backdrop-filter: blur(4px);
            
            text {
                color: #fff;
                font-size: 22rpx;
                margin-left: 6rpx;
            }
          }
          
          .close-btn {
              width: 60rpx;
              height: 60rpx;
              border-radius: 30rpx;
              background: rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              backdrop-filter: blur(4px);
          }
      }
    }
    
    .bottom-info {
        pointer-events: auto;
        margin-bottom: 20rpx;
        text-shadow: 0 1rpx 2rpx rgba(0,0,0,0.5);
        
        .live-title {
            display: block;
            font-size: 32rpx;
            color: #fff;
            font-weight: bold;
            margin-bottom: 8rpx;
        }
        
        .live-desc {
            font-size: 24rpx;
            color: rgba(255,255,255,0.8);
            line-height: 1.4;
        }
    }
  }
}

.danmu-container {
  position: absolute;
  bottom: 140rpx;
  left: 20rpx;
  width: 70%;
  height: 300rpx;
  z-index: 2;
  pointer-events: none;
  
  .danmu-item {
    padding: 8rpx 16rpx;
    margin-bottom: 12rpx;
    background: rgba(0,0,0,0.3);
    border-radius: 20rpx;
    align-self: flex-start;
    display: inline-block;
    max-width: 100%;
    backdrop-filter: blur(2px);
    
    .danmu-user {
      color: #a0cfff;
      font-size: 26rpx;
      margin-right: 10rpx;
      font-weight: bold;
    }
    
    .danmu-content {
      color: #fff;
      font-size: 26rpx;
    }
  }
}

.bottom-toolbar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 110rpx;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    box-sizing: border-box;
    z-index: 3;
    justify-content: space-between;
    
    .input-wrap {
        flex: 1;
        margin-right: 20rpx;
        
        .chat-input {
            width: 100%;
            height: 72rpx;
            background: rgba(0,0,0,0.3);
            border-radius: 36rpx;
            padding: 0 30rpx;
            font-size: 28rpx;
            color: #fff;
            backdrop-filter: blur(4px);
        }
    }
    
    .action-btn {
        width: 80rpx;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        
        .badge {
            position: absolute;
            top: 4rpx;
            right: 4rpx;
            background: #ff4d4f;
            color: #fff;
            font-size: 20rpx;
            padding: 2rpx 8rpx;
            border-radius: 16rpx;
            min-width: 28rpx;
            text-align: center;
        }
        
        &.share-btn {
            position: relative;
            .share-trigger {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
            }
        }
    }
}

// Popup Styles
.goods-popup {
    padding: 30rpx;
    background: #fff;
    border-radius: 32rpx 32rpx 0 0;
    height: 60vh;
    display: flex;
    flex-direction: column;
    
    .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;
        
        .title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }
    }
    
    .goods-list {
        flex: 1;
        height: 0; // for scroll-view
        
        .goods-item {
            display: flex;
            padding: 20rpx 0;
            border-bottom: 1rpx solid #f5f5f5;
            
            .goods-img {
                width: 140rpx;
                height: 140rpx;
                border-radius: 12rpx;
                margin-right: 20rpx;
                background: #f5f5f5;
            }
            
            .goods-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                
                .goods-name {
                    font-size: 28rpx;
                    color: #333;
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .goods-bottom {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    
                    .goods-price {
                        font-size: 32rpx;
                        color: #ff4d4f;
                        font-weight: bold;
                    }
                    
                    .buy-btn {
                        padding: 10rpx 24rpx;
                        background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
                        color: #fff;
                        font-size: 24rpx;
                        border-radius: 30rpx;
                    }
                }
            }
        }
    }
}

.gift-popup {
    padding: 30rpx;
    background: #fff;
    border-radius: 32rpx 32rpx 0 0;
    
    .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30rpx;
        
        .title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }
    }
    
    .gift-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20rpx;
        padding-bottom: 20rpx;
        
        .gift-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            
            .gift-icon-box {
                width: 100rpx;
                height: 100rpx;
                margin-bottom: 10rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f5f5f5;
                border-radius: 50%;
            }
            
            .gift-name {
                font-size: 24rpx;
                color: #333;
                margin-bottom: 4rpx;
            }
            
            .gift-price {
                font-size: 20rpx;
                color: #999;
            }
        }
    }
}

/* 礼物动画 */
.gift-animation {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
    animation: giftFloat 2s ease-in-out;
    
    .gift-name {
        font-size: 32rpx;
        font-weight: bold;
        margin-top: 10rpx;
    }
}

@keyframes giftFloat {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
    }
    20% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.2);
    }
    80% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -100%) scale(0.8);
    }
}

/* 贡献榜 */
.contributors-popup {
    padding: 30rpx;
    background: #fff;
    height: 100%;
    
    .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30rpx;
        
        .title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }
    }
    
    .contributors-list {
        height: calc(100% - 80rpx);
        
        .contributor-item {
            display: flex;
            align-items: center;
            padding: 20rpx 0;
            border-bottom: 1rpx solid #f5f5f5;
            
            .rank-number {
                width: 50rpx;
                font-size: 28rpx;
                font-weight: bold;
                color: #999;
                text-align: center;
                
                &.top-three {
                    color: #ff4d4f;
                }
            }
            
            .contributor-avatar {
                width: 60rpx;
                height: 60rpx;
                border-radius: 30rpx;
                margin-right: 16rpx;
                background: #f5f5f5;
            }
            
            .contributor-name {
                flex: 1;
                font-size: 28rpx;
                color: #333;
            }
            
            .contributor-amount {
                font-size: 26rpx;
                color: #ff4d4f;
                font-weight: bold;
            }
        }
        
        .empty-contributors {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200rpx;
            color: #999;
            font-size: 24rpx;
        }
    }
}
</style>
