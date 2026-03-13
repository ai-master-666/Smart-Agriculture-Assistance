<template>
  <view class="chat-container">
    <view class="chat-header">
      <text class="header-title">智能问答</text>
      <text class="clear-btn" @click="clearChat">清空</text>
    </view>
    
    <scroll-view scroll-y class="message-list" :scroll-top="scrollTop" :scroll-into-view="scrollIntoView">
      <view class="message-item" v-for="(msg, index) in messages" :key="msg.id" :id="`msg-${msg.id}`">
        <view class="msg-row bot" v-if="msg.role === 'assistant'">
          <u-avatar icon="server-fill" bg-color="#667eea" size="40"></u-avatar>
          <view class="msg-bubble bot-bubble">
            <text>{{ msg.content }}</text>
          </view>
        </view>
        
        <view class="msg-row user" v-else>
          <view class="msg-bubble user-bubble">
            <text>{{ msg.content }}</text>
          </view>
          <u-avatar icon="account-fill" bg-color="#ff9900" size="40"></u-avatar>
        </view>
      </view>
      
      <view class="loading-row" v-if="isLoading">
        <u-loading-icon mode="circle"></u-loading-icon>
        <text class="loading-text">AI 正在思考中...</text>
      </view>
    </scroll-view>

    <view class="quick-questions" v-if="messages.length <= 1">
      <text class="quick-title">常见问题</text>
      <view class="quick-list">
        <view 
          class="quick-item" 
          v-for="question in quickQuestions" 
          :key="question"
          @click="handleQuickQuestion(question)"
        >
          {{ question }}
        </view>
      </view>
    </view>

    <view class="input-area">
      <view class="quick-actions">
        <view class="action-tag" @click="goToPlan">生成旅游攻略</view>
      </view>
      <view class="input-row">
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
    scrollTop.value = messages.value.length * 1000
    scrollIntoView.value = `msg-${messages.value[messages.value.length - 1].id}`
  })
}

const goToPlan = () => {
  uni.navigateTo({ url: '/pages/ai/plan' })
}

const quickQuestions = [
  '苹果树怎么修剪？',
  '水稻病虫害防治',
  '最近村庄有什么活动？',
  '有机蔬菜种植技术'
]

const handleQuickQuestion = (question: string) => {
  inputValue.value = question
  handleSend()
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
    // 调用百度文心一言API
    const aiReply = await callWenxinAPI(query)
    messages.value.push(aiReply)
  } catch (e) {
    console.error('AI Service Error:', e)
    const mockReplies: Record<string, string> = {
      '苹果树怎么修剪？': '苹果树的修剪主要在冬季进行，具体步骤如下：\n1. 剪除病枝、弱枝和交叉枝\n2. 保持树冠通风透光\n3. 短截徒长枝，促进侧枝生长\n4. 结果枝组更新修剪',
      '水稻病虫害防治': '水稻常见病虫害防治方法：\n1. 稻瘟病：选用抗病品种，加强肥水管理\n2. 纹枯病：及时清除病株，使用多菌灵防治\n3. 稻飞虱：使用吡虫啉防治\n4. 螟虫：使用Bt乳剂防治',
      '有机蔬菜种植技术': '有机蔬菜种植关键技术：\n1. 选址：选择无污染源的地块\n2. 土壤改良：使用有机肥提升土壤肥力\n3. 品种选择：选用抗病抗虫品种\n4. 轮作换茬：减少病虫害发生\n5. 物理防治：使用黄板、防虫网等',
      'default': `收到您的问题："${query}"。\n\n我可以为您提供以下方面的帮助：\n🌾 农作物种植技术\n🐛 病虫害防治方法\n🏘️ 村庄旅游信息\n📋 农业政策咨询\n💰 农产品市场行情\n\n请详细描述您的问题，我会尽力为您解答！`
    }
    const mockReply: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: mockReplies[query] || mockReplies['default'],
      timestamp: Date.now()
    }
    messages.value.push(mockReply)
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

// 调用后端AI API
const callWenxinAPI = async (query: string): Promise<ChatMessage> => {
  // 智能模拟回复，根据问题类型生成不同的回复
  const generateSmartReply = (q: string): string => {
    // 农业种植相关
    if (q.includes('种植') || q.includes('栽培') || q.includes('种植技术')) {
      return `关于您的种植问题，我为您提供以下建议：\n\n1. **土壤准备**：选择肥沃、排水良好的土壤，可添加有机肥改善土壤结构\n2. **品种选择**：根据当地气候和土壤条件选择适合的品种\n3. **播种时间**：根据作物生长周期和当地气候确定最佳播种时间\n4. **田间管理**：定期浇水、施肥，及时防治病虫害\n5. **收获时机**：掌握最佳收获时间，确保产量和品质\n\n如果您需要更具体的种植技术指导，请提供更多详细信息。`;
    }
    
    // 病虫害防治相关
    if (q.includes('病虫害') || q.includes('防治') || q.includes('病') || q.includes('虫')) {
      return `关于病虫害防治，我为您提供以下建议：\n\n1. **预防为主**：选择抗病虫品种，加强田间管理，提高作物抗性\n2. **物理防治**：使用黄板、防虫网等物理方法防治害虫\n3. **生物防治**：利用天敌、生物农药等生物方法防治病虫害\n4. **化学防治**：必要时使用低毒、高效的化学农药，注意安全间隔期\n5. **综合防治**：结合多种防治方法，达到最佳防治效果\n\n如果您需要针对特定病虫害的防治方法，请提供更多详细信息。`;
    }
    
    // 乡村旅游相关
    if (q.includes('旅游') || q.includes('景点') || q.includes('游玩') || q.includes('攻略')) {
      return `关于乡村旅游，我为您提供以下建议：\n\n1. **最佳时间**：根据季节选择最佳旅游时间，春季赏花，秋季赏叶\n2. **推荐景点**：乡村特色景点、生态农场、农家乐、民俗文化村\n3. **特色活动**：采摘、插秧、收割等农事体验活动\n4. **交通建议**：自驾或乘坐公共交通，提前规划路线\n5. **住宿推荐**：乡村民宿、农家乐，体验当地特色\n\n如果您需要具体的旅游攻略，请提供更多详细信息，如目的地、时间等。`;
    }
    
    // 农产品相关
    if (q.includes('农产品') || q.includes('特产') || q.includes('购买')) {
      return `关于农产品，我为您提供以下信息：\n\n1. **特色农产品**：当地特色水果、蔬菜、粮油、畜禽产品等\n2. **购买渠道**：当地农贸市场、电商平台、农产品直销点\n3. **品质鉴别**：注意查看产品新鲜度、包装、保质期等\n4. **储存方法**：根据不同农产品的特性，采用适当的储存方法\n5. **食用建议**：合理搭配，健康饮食\n\n如果您需要具体的农产品信息，请提供更多详细信息。`;
    }
    
    // 通用回复
    return `感谢您的问题！作为您的智能农业助手，我可以为您提供以下方面的帮助：\n\n🌾 **农作物种植技术**：各类作物的种植方法、管理技巧\n🐛 **病虫害防治**：常见病虫害的识别与防治方法\n🏘️ **乡村旅游**：景点推荐、旅游攻略、特色活动\n📋 **农业政策**：最新农业政策解读、补贴信息\n💰 **农产品市场**：市场行情、价格走势、销售渠道\n\n请详细描述您的问题，我会为您提供更专业、准确的回答！`;
  };
  
  try {
    // 调用后端AI API
    console.log('开始调用后端AI API...');
    console.log('请求问题:', query);
    
    const response = await chatWithAI({ question: query });
    console.log('API响应数据:', response);
    
    if (response && response.answer) {
      console.log('API调用成功，返回结果:', response.answer.substring(0, 50) + '...');
      return {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: Date.now()
      };
    } else {
      throw new Error('API调用失败，未返回有效答案');
    }
  } catch (error) {
    console.error('后端AI API调用失败，详细错误:', error);
    
    return {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `感谢您的问题！\n\nAPI调用遇到了以下错误：\n${error instanceof Error ? error.message : '未知错误'}\n\n现在，我将使用智能模拟回复为您提供答案：\n\n${generateSmartReply(query)}`,
      timestamp: Date.now()
    };
  }
}

// 获取百度API access_token
const getAccessToken = async (apiKey: string, secretKey: string): Promise<string> => {
  // 检查本地存储是否有有效的access_token
  const storedToken = uni.getStorageSync('wenxin_access_token');
  const tokenExpiry = uni.getStorageSync('wenxin_token_expiry');
  
  console.log('检查本地存储的token...');
  console.log('存储的token:', storedToken ? storedToken.substring(0, 20) + '...' : '无');
  console.log('过期时间:', tokenExpiry ? new Date(tokenExpiry).toLocaleString() : '无');
  console.log('当前时间:', new Date().toLocaleString());
  
  // 如果token存在且未过期，直接使用
  if (storedToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log('使用本地存储的token');
    return storedToken;
  }
  
  // 否则，重新获取
  console.log('开始请求新的access_token...');
  const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;
  console.log('请求URL:', tokenUrl);
  
  const response = await uni.request({
    url: tokenUrl,
    method: 'GET'
  });
  
  console.log('获取access_token响应状态:', response.statusCode);
  console.log('获取access_token响应数据:', response.data);
  
  if (response.statusCode === 200 && response.data && response.data.access_token) {
    const accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in || 3600; // 默认1小时
    
    console.log('获取access_token成功，有效期:', expiresIn, '秒');
    
    // 存储token和过期时间
    uni.setStorageSync('wenxin_access_token', accessToken);
    uni.setStorageSync('wenxin_token_expiry', Date.now() + (expiresIn - 300) * 1000); // 提前5分钟过期
    
    return accessToken;
  } else {
    const errorMsg = `获取access_token失败，状态码: ${response.statusCode}，响应: ${JSON.stringify(response.data)}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

const clearChat = () => {
  messages.value = [
    {
      id: 'welcome',
      role: 'assistant',
      content: '您好！我是您的 AI 农业助手。您可以问我关于农作物种植、病虫害防治或村庄旅游的问题。',
      timestamp: Date.now()
    }
  ]
}
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #eee;
  
  .header-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
  
  .clear-btn {
    font-size: 26rpx;
    color: #667eea;
  }
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
      white-space: pre-wrap;
    }
  }
}

.quick-questions {
  padding: 20rpx 30rpx;
  background: #fff;
  border-top: 1rpx solid #eee;
  
  .quick-title {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 16rpx;
    display: block;
  }
  
  .quick-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    
    .quick-item {
      padding: 12rpx 24rpx;
      background: #f5f5f5;
      border-radius: 24rpx;
      font-size: 24rpx;
      color: #333;
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
  flex-direction: column;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  
  .quick-actions {
    display: flex;
    margin-bottom: 16rpx;
    
    .action-tag {
      font-size: 24rpx;
      color: #667eea;
      background: #f0f5ff;
      padding: 8rpx 20rpx;
      border-radius: 24rpx;
      margin-right: 16rpx;
    }
  }
  
  .input-row {
    display: flex;
    align-items: center;
    width: 100%;
  }
  
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
