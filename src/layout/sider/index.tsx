import styles from './index.module.less'
import IconRight from '~/assets/icons/icon-right.svg'

const Sider = defineComponent({
  setup(_, { slots }) {
    const { isCollapsed, openSider, closeSider } = useSider()
    const func = () => [closeSider, openSider][Number(isCollapsed.value)]()
    const classNames = computed(() => ({
      [styles.sider]: true,
      [styles.collapsed]: isCollapsed.value,
    }))
    return () => {
      return (
        <aside class={classNames.value}>
          {slots.default?.()}

          <div class={styles.trigger} onClick={func}>
            <img src={IconRight} class={styles['icon-right']} alt="arrow" />
          </div>
        </aside>
      )
    }
  },
})

export default Sider
