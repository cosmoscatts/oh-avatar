/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gtag: (...params: any[]) => void
}
