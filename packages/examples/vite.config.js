import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  // root: process.cwd(),
  plugins: [reactRefresh()],
  server: {
    // 启动端口
    port: 8940,
    open: true,
  },
})
