import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'api-tool-sdk',
      fileName: 'api-tool-sdk'
    }
  },
  plugins: [dts()]
})
