import { resolve } from 'path'
import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'
import dts from 'vite-plugin-dts'

const external = [...builtinModules, ...builtinModules.map((m) => `node:${m}`)]

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'api-tool-sdk',
      // the proper extensions will be added
      fileName: 'api-tool-sdk',
    },
    rollupOptions: {
      external: [...external],
      output: {
        globals: {},
      },
    },
  },
  plugins: [dts()]
})
