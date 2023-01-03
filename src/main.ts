import '@unocss/reset/tailwind.css'
import 'uno.css'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import '~/styles/reset.css'
import '~/styles/global.less'
import piniaPluginPersist from 'pinia-plugin-persist-uni'
import i18n from './i18n'

import App from './App'

createApp(App)
  .use(createPinia().use(piniaPluginPersist))
  .use(i18n)
  .mount('#app')
