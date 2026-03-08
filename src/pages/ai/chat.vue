<template>
  <view class="chat-container">
    <scroll-view scroll-y class="message-list" :scroll-top="scrollTop" :scroll-into-view="scrollIntoView">
      <view class="message-item" v-for="(msg, index) in messages" :key="msg.id" :id="`msg-${msg.id}`">
        <!-- 机器人消息 -->
        <view class="msg-row bot" v-if="msg.role === 'assistant'">
          <u-avatar icon="server-fill" bg-color="#667eea" size="40"></u-avatar>
          <view class="msg-bubble bot-bubble">
            <text>{{ msg.content }}</text>
          </view>
        </view>
        
        <!-- 用户消息 -->
        <view class="msg-row user" v-else>
          <view class="msg-bubble user-bubble">
            <text>{{ msg.content }}</text>
          </view>
          <u-avatar icon="account-fill" bg-color="#ff9900" size="40"></u-avatar>
        </view>
      </view>
      
      <!-- 加载状态 -->
      <view class="loading-row" v-if="isLoading">
        <u-loading-icon mode="circle"></u-loading-icon>
        <text class="loading-text">AI 正在思考中...</text>
      </view>
    </scroll-view>

    <view class="input-area">
      <input 
        class="input-box" 
        v-model="inputValue" 
        placeholder="请输入您的问题..." 
        confirm-type="send"
        @confirm="handleSend"
      />
      <button class="send-btn" @click="handleSend" :disabled="isLoading || !inputValue.trim()">发送</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { chatWithAI } from '@/api/ai'
import type { ChatMessage } from '@/api/ai'

const messages = ref<ChatMessage[]>([
  {
    id: 'welcome',
    role: 'assistant',
    content: '您好！我是您的 AI 农业助手。您可以问我关于农作物种植、病虫害防治或村庄旅游的问题。',
    timestamp: Date.now()
  }
])
const inputValue = ref('')
const isLoading = ref(false)
const scrollTop = ref(0)
const scrollIntoView = ref('')

onLoad((options: any) => {
  if (options.q) {
    inputValue.value = decodeURIComponent(options.q)
    handleSend()
  }
})

const scrollToBottom = () => {
  nextTick(() => {
    scrollTop.value = messages.value.length * 1000 // 简单粗暴滚动到底部
    scrollIntoView.value = `msg-${messages.value[messages.value.length - 1].id}`
  })
}

const handleSend = async () => {
  if (!inputValue.value.trim() || isLoading.value) return
  
  const userMsg: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: inputValue.value,
    timestamp: Date.now()
  }
  
  messages.value.push(userMsg)
  const query = inputValue.value
  inputValue.value = ''
  isLoading.value = true
  scrollToBottom()
  
  try {
    // 调用预留的 AI 接口
    // const res = await chatWithAI(query, messages.value)
    // messages.value.push(res)
    
    // 模拟 AI 回复（在未对接真实后端前）
    setTimeout(() => {
      const mockReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `收到您的问题：“${query}”。\n(此处为 AI 接口预留位置，后续对接 DeepSeek/ChatGPT 后将返回真实智能回答)`,
        timestamp: Date.now()
      }
      messages.value.push(mockReply)
      isLoading.value = false
      scrollToBottom()
    }, 1500)
    
  } catch (e) {
    console.error(e)
    isLoading.value = false
    uni.showToast({ title: 'AI 服务暂时不可用', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.message-list {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;
  
  .message-item {
    margin-bottom: 30rpx;
  }
  
  .msg-row {
    display: flex;
    align-items: flex-start;
    
    &.bot {
      justify-content: flex-start;
      .msg-bubble { margin-left: 20rpx; background: #fff; color: #333; }
    }
    
    &.user {
      justify-content: flex-end;
      .msg-bubble { margin-right: 20rpx; background: #667eea; color: #fff; }
    }
    
    .msg-bubble {
      max-width: 70%;
      padding: 20rpx;
      border-radius: 16rpx;
      font-size: 28rpx;
      line-height: 1.5;
      word-break: break-all;
    }
  }
}

.loading-row {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx;
  
  .loading-text {
    font-size: 24rpx;
    color: #999;
    margin-left: 10rpx;
  }
}

.input-area {
  padding: 20rpx;
  background: #fff;
  display: flex;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  
  .input-box {
    flex: 1;
    height: 72rpx;
    background: #f5f5f5;
    border-radius: 36rpx;
    padding: 0 30rpx;
    font-size: 28rpx;
  }
  
  .send-btn {
    margin-left: 20rpx;
    height: 72rpx;
    line-height: 72rpx;
    padding: 0 40rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-radius: 36rpx;
    font-size: 28rpx;
    
    &[disabled] {
      opacity: 0.6;
    }
  }
}
</style>
