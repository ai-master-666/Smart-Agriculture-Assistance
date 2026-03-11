<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import { storage } from '@/utils/storage'

onLaunch(() => {
  console.log("App Launch")
  // 检查登录状态
  const token = storage.get('access_token')
  if (token) {
    console.log('用户已登录')
  }
})

onShow(() => {
  console.log("App Show")
})

onHide(() => {
  console.log("App Hide")
})
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-plus/theme.scss";
@import "uview-plus/index.scss";

/* 全局样式 */
page {
  background-color: #f8f8f8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

button {
  border: none;
}

button::after {
  border: none;
}
</style>
