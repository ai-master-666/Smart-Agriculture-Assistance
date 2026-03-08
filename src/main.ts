import { createSSRApp } from "vue"
import App from "./App.vue"
import uviewPlus from 'uview-plus'

export function createApp() {
  const app = createSSRApp(App)
  
  // 使用 uView Plus UI 组件库
  app.use(uviewPlus)
  
  return {
    app,
  }
}
