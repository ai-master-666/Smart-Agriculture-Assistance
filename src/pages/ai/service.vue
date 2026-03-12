<template>
  <view class="container">
    <view class="header">
      <text class="title">智能客服</text>
      <text class="subtitle">24小时在线，为您解答疑问</text>
    </view>
    
    <view class="chat-container">
      <view class="chat-messages">
        <!-- 系统欢迎消息 -->
        <view class="message system-message">
          <text class="message-content">您好！我是智能客服助手，有什么可以帮您的吗？</text>
          <text class="message-time">{{ currentTime }}</text>
        </view>
        
        <!-- 消息列表 -->
        <view 
          v-for="(message, index) in messages" 
          :key="index"
          :class="['message', message.type === 'user' ? 'user-message' : 'ai-message']"
        >
          <view class="message-avatar" v-if="message.type === 'user'">
            <text class="avatar-text">我</text>
          </view>
          <view class="message-avatar" v-else>
            <text class="avatar-text">AI</text>
          </view>
          <view class="message-content-wrapper">
            <text class="message-content">{{ message.content }}</text>
            <text class="message-time">{{ message.timestamp }}</text>
          </view>
        </view>
        
        <!-- 加载中状态 -->
        <view class="message ai-message" v-if="isLoading">
          <view class="message-avatar">
            <text class="avatar-text">AI</text>
          </view>
          <view class="message-content-wrapper">
            <view class="loading-indicator">
              <view class="loading-dot"></view>
              <view class="loading-dot"></view>
              <view class="loading-dot"></view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 输入区域 -->
      <view class="chat-input">
        <u-input 
          v-model="inputMessage" 
          placeholder="请输入您的问题..."
          @confirm="sendMessage"
        />
        <u-button type="primary" @click="sendMessage" :disabled="!inputMessage.trim()">发送</u-button>
      </view>
    </view>
    
    <!-- 常见问题 -->
    <view class="faq-section">
      <text class="section-title">常见问题</text>
      <view class="faq-list">
        <view 
          v-for="faq in faqs" 
          :key="faq.id"
          class="faq-item"
          @click="selectFaq(faq.question)"
        >
          <text class="faq-question">{{ faq.question }}</text>
          <text class="faq-arrow">→</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const inputMessage = ref('');
const messages = ref<any[]>([]);
const isLoading = ref(false);

const currentTime = computed(() => {
  return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
});

const faqs = [
  { id: 1, question: '如何预约村庄导览？', answer: '您可以在首页的"村庄导览"模块进行预约，选择日期和时间，我们会安排专业导游为您服务。' },
  { id: 2, question: '农产品如何购买？', answer: '您可以在"乡村商城"页面浏览和购买各种农产品，支持在线支付和物流配送。' },
  { id: 3, question: '如何参加农技培训课程？', answer: '在"农技课堂"页面，您可以查看课程安排，选择感兴趣的课程进行报名参加。' },
  { id: 4, question: '村庄有哪些旅游景点？', answer: '我们村庄有多个特色景点，包括传统村落、生态农场、文化广场等，您可以在"AI助手"的"景点推荐"中获取详细信息。' }
];

const mockResponses = [
  '您好！请问有什么可以帮助您的？',
  '感谢您的咨询，我们会尽快为您处理。',
  '请问您需要了解哪方面的信息？',
  '我们的客服热线是400-123-4567，您也可以通过电话咨询。',
  '感谢您的反馈，我们会不断改进服务质量。'
];

const sendMessage = () => {
  if (!inputMessage.value.trim()) return;
  
  // 添加用户消息
  const userMessage = {
    type: 'user',
    content: inputMessage.value.trim(),
    timestamp: currentTime.value
  };
  messages.value.push(userMessage);
  
  // 清空输入框
  inputMessage.value = '';
  
  // 显示加载状态
  isLoading.value = true;
  
  // 模拟AI回复
  setTimeout(() => {
    isLoading.value = false;
    
    const aiResponse = {
      type: 'ai',
      content: getAIResponse(userMessage.content),
      timestamp: currentTime.value
    };
    messages.value.push(aiResponse);
  }, 1000);
};

const getAIResponse = (message: string): string => {
  // 简单的关键词匹配
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('预约') || lowerMessage.includes('导览')) {
    return '您可以在首页的"村庄导览"模块进行预约，选择日期和时间，我们会安排专业导游为您服务。';
  } else if (lowerMessage.includes('购买') || lowerMessage.includes('商品') || lowerMessage.includes('农产品')) {
    return '您可以在"乡村商城"页面浏览和购买各种农产品，支持在线支付和物流配送。';
  } else if (lowerMessage.includes('课程') || lowerMessage.includes('培训') || lowerMessage.includes('学习')) {
    return '在"农技课堂"页面，您可以查看课程安排，选择感兴趣的课程进行报名参加。';
  } else if (lowerMessage.includes('景点') || lowerMessage.includes('旅游') || lowerMessage.includes('玩')) {
    return '我们村庄有多个特色景点，包括传统村落、生态农场、文化广场等，您可以在"AI助手"的"景点推荐"中获取详细信息。';
  } else if (lowerMessage.includes('联系') || lowerMessage.includes('电话') || lowerMessage.includes('客服')) {
    return '我们的客服热线是400-123-4567，您也可以通过本页面直接咨询。';
  } else {
    // 随机返回一个默认回复
    const randomIndex = Math.floor(Math.random() * mockResponses.length);
    return mockResponses[randomIndex];
  }
};

const selectFaq = (question: string) => {
  inputMessage.value = question;
  sendMessage();
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  margin-bottom: 30rpx;
  text-align: center;
  
  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .subtitle {
    font-size: 24rpx;
    color: #666;
  }
}

.chat-container {
  background-color: #fff;
  border-radius: 8rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  
  .chat-messages {
    padding: 20rpx;
    max-height: 500rpx;
    overflow-y: auto;
    
    .message {
      display: flex;
      margin-bottom: 20rpx;
      
      &.system-message {
        justify-content: center;
        
        .message-content {
          background-color: #f0f0f0;
          color: #666;
          padding: 10rpx 20rpx;
          border-radius: 20rpx;
          font-size: 22rpx;
        }
        
        .message-time {
          display: block;
          text-align: center;
          margin-top: 5rpx;
          font-size: 18rpx;
          color: #999;
        }
      }
      
      &.user-message {
        flex-direction: row-reverse;
        
        .message-avatar {
          margin-left: 10rpx;
          margin-right: 0;
        }
        
        .message-content-wrapper {
          align-items: flex-end;
          
          .message-content {
            background-color: #4caf50;
            color: #fff;
            border-radius: 20rpx 20rpx 5rpx 20rpx;
          }
        }
      }
      
      &.ai-message {
        flex-direction: row;
        
        .message-avatar {
          margin-right: 10rpx;
        }
        
        .message-content {
          background-color: #f0f0f0;
          color: #333;
          border-radius: 5rpx 20rpx 20rpx 20rpx;
        }
      }
      
      .message-avatar {
        width: 48rpx;
        height: 48rpx;
        border-radius: 50%;
        background-color: #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .avatar-text {
          font-size: 24rpx;
          font-weight: bold;
          color: #666;
        }
      }
      
      .message-content-wrapper {
        max-width: 70%;
        display: flex;
        flex-direction: column;
        
        .message-content {
          padding: 15rpx 20rpx;
          font-size: 24rpx;
          line-height: 1.4;
        }
        
        .message-time {
          font-size: 18rpx;
          color: #999;
          margin-top: 5rpx;
          align-self: flex-end;
        }
      }
      
      .loading-indicator {
        display: flex;
        align-items: center;
        padding: 15rpx 20rpx;
        
        .loading-dot {
          width: 10rpx;
          height: 10rpx;
          border-radius: 50%;
          background-color: #999;
          margin: 0 5rpx;
          animation: loading 1.4s ease-in-out infinite;
          
          &:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          &:nth-child(3) {
            animation-delay: 0.4s;
          }
        }
      }
    }
  }
  
  .chat-input {
    display: flex;
    gap: 10rpx;
    padding: 20rpx;
    border-top: 1rpx solid #f0f0f0;
    
    u-input {
      flex: 1;
      border-radius: 8rpx;
      background-color: #f5f5f5;
    }
    
    u-button {
      width: 100rpx;
    }
  }
}

.faq-section {
  background-color: #fff;
  border-radius: 8rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  
  .section-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 15rpx;
  }
  
  .faq-list {
    
    .faq-item {
      padding: 15rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      &:last-child {
        border-bottom: none;
      }
      
      .faq-question {
        font-size: 24rpx;
        color: #333;
        flex: 1;
      }
      
      .faq-arrow {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

@keyframes loading {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10rpx);
  }
}
</style>