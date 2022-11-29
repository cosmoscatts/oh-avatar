import styles from './index.module.less'
import { SCREEN } from '~/utils/constant'

const Container = defineComponent({
  setup() {
    const { isCollapsed, openSider, closeSider } = useSider()
    const handleWindowResize = () =>
      [openSider, closeSider][Number(window.innerWidth <= SCREEN.lg)]()
    const classNames = computed(() => (
      [[styles.container], [styles.container, styles.full]][Number(isCollapsed.value)]))

    onMounted(() => {
      (function () {
        const throttle = function (
          type: string,
          customEventName: string,
          obj: Window,
        ) {
          obj = obj || window
          let running = false
          const func = () => {
            if (running)
              return

            running = true
            requestAnimationFrame(() => {
              obj.dispatchEvent(new CustomEvent(customEventName))
              running = false
            })
          }
          obj.addEventListener(type, func)
        }
        throttle('resize', 'optimizedResize', window)
      })()

      window.addEventListener('optimizedResize', handleWindowResize)
    })

    onUnmounted(() => {
      window.removeEventListener('optimizedResize', handleWindowResize)
    })

    return () => {
      return (
        <section class={classNames}>
          <slot />
        </section>
      )
    }
  },
})

export default Container
