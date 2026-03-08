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
      
      <!-- 直播信息覆盖层 -->
      <view class="overlay-info">
        <view class="top-bar">
          <view class="host-info">
            <image :src="liveInfo.host_avatar || '/static/default-avatar.png'" mode="aspectFill" class="host-avatar"></image>
            <view class="host-detail">
                <text class="host-name">{{ liveInfo.host_name || '主播' }}</text>
                <text class="live-status-badge">直播中</text>
            </view>
          </view>
          
          <view class="viewer-count">
            <u-icon name="eye" size="14" color="#fff"></u-icon>
            <text>{{ viewerCount }}</text>
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

    <!-- 底部输入框 -->
    <view class="input-section">
      <input 
        v-model="inputValue"
        placeholder="发条弹幕吧~"
        class="danmu-input"
        confirm-type="send"
        @confirm="sendDanmu"
      />
      <button class="send-btn" @click="sendDanmu">发送</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getLiveDetail } from '@/api/live'
import type { LiveRoom } from '@/api/live'

const roomId = ref<number>(0)
const liveUrl = ref('http://vjs.zencdn.net/v/oceans.mp4') // Default demo video
const viewerCount = ref(0)
const inputValue = ref('')
const scrollTop = ref(0)
const liveInfo = ref<Partial<LiveRoom>>({})
const danmuList = ref<any[]>([])

let socketTask: any = null
let heartbeatInterval: any = null

onLoad((options: any) => {
  if (options.id) {
    roomId.value = parseInt(options.id)
    loadLiveInfo(roomId.value)
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
    // Mock WebSocket connection for now as we don't have a real WS server running
    // In real implementation:
    // socketTask = uni.connectSocket({
    //     url: `ws://127.0.0.1:8000/api/ws/live/${roomId.value}`,
    //     success: () => console.log('Socket connecting...')
    // })
    
    // socketTask.onOpen(() => {
    //     console.log('Socket connected')
    //     startHeartbeat()
    // })
    
    // socketTask.onMessage((res) => {
    //     const data = JSON.parse(res.data)
    //     handleSocketMessage(data)
    // })
    
    // Mock incoming messages
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
  
  // In real app: socketTask.send({ data: JSON.stringify({ type: 'chat', content: inputValue.value }) })
  
  inputValue.value = ''
}

const scrollToBottom = () => {
    nextTick(() => {
        scrollTop.value = danmuList.value.length * 100 // Estimate height
    })
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
}

.video-section {
  position: relative;
  width: 100%;
  height: 420rpx;
  background-color: #000;
  
  .live-video {
    width: 100%;
    height: 100%;
  }
  
  .overlay-info {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: none; // Allow clicks to pass through to video controls
    
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      
      .host-info {
        display: flex;
        align-items: center;
        background: rgba(0,0,0,0.3);
        padding: 6rpx 16rpx 6rpx 6rpx;
        border-radius: 40rpx;
        
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
            
            .host-name {
                font-size: 24rpx;
                color: #fff;
                font-weight: bold;
            }
            
            .live-status-badge {
                font-size: 18rpx;
                color: #fff;
                opacity: 0.8;
            }
        }
      }
      
      .viewer-count {
        display: flex;
        align-items: center;
        background: rgba(0,0,0,0.3);
        padding: 6rpx 16rpx;
        border-radius: 20rpx;
        
        text {
            color: #fff;
            font-size: 22rpx;
            margin-left: 6rpx;
        }
      }
    }
    
    .bottom-info {
        padding-bottom: 20rpx;
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
        }
    }
  }
}

.danmu-container {
  flex: 1;
  padding: 20rpx;
  // background: rgba(0,0,0,0.2);
  
  .danmu-item {
    padding: 8rpx 16rpx;
    margin-bottom: 12rpx;
    background: rgba(0,0,0,0.3);
    border-radius: 20rpx;
    align-self: flex-start;
    display: inline-block;
    max-width: 80%;
    
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

.input-section {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #2c2c2c;
  
  .danmu-input {
    flex: 1;
    height: 72rpx;
    line-height: 72rpx;
    background: #3a3a3a;
    border-radius: 36rpx;
    padding: 0 30rpx;
    font-size: 28rpx;
    color: #fff;
  }
  
  .send-btn {
    margin-left: 20rpx;
    padding: 0 40rpx;
    height: 72rpx;
    line-height: 72rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-radius: 36rpx;
    font-size: 28rpx;
    border: none;
    
    &::after {
        border: none;
    }
  }
}
</style>
