import styles from './index.module.less'
import IconGitHub from '~/assets/icons/icon-github.svg'
import Logo from '~/components/Logo.vue'
import { recordEvent } from '~/utils/ga'

const Header = defineComponent({
  setup() {
    return () => {
      return (
        <header class={styles.header}>
          <Logo />
          <h2 class={styles['site-title']}>Color Avatar</h2>
          <div class={styles['header-right']}>
            <a
              href="https://github.com/cosmoscatts/oh-my-avatar"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              <button
                type="button"
                class={styles['github-button']}
                onClick={
                  () => recordEvent('click_github', {
                    event_category: 'click',
                  })
                }
              >
                <img src={IconGitHub} alt="GitHub" />
                <span class={styles.text}>GitHub</span>
              </button>
            </a>
          </div>
        </header>
      )
    }
  },
})

export default Header
