import styles from './index.module.less'
import { Locale } from '~/enums'

const Footer = defineComponent({
  setup() {
    const { locale } = useI18n()
    const switchLocale = () => locale.value = [Locale.EN, Locale.ZH][Number(locale.value === Locale.EN)]
    return () => {
      return (
        <footer class={styles.footer}>
          <div>
            Practice Project @COSMOSCATTS
          </div>
          <div class={styles.divider}>|</div>
          <div class={styles.locale} onClick={switchLocale}>
            {['简体中文', 'English'][Number(locale.value === Locale.EN)]}
          </div>
        </footer>
      )
    }
  },
})

export default Footer
