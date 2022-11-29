import { resolve } from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue({
      reactivityTransform: true,
    }),
    VueJsx(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue\??/, // .vue
      ],
      dts: 'src/auto-import.d.ts',
      imports: ['vue', 'pinia', '@vueuse/core', 'vue-i18n'],
      dirs: ['src/composables', 'src/store'],
      vueTemplate: true,
    }),
    Components({
      dts: 'src/components.d.ts',
      extensions: ['vue', 'tsx', 'jsx'],
    }),
    UnoCSS(),
  ],
})
