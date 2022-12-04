import { withModifiers } from 'vue'
import styles from './index.module.less'

interface DownloadModalProps {
  visible?: boolean
  imageUrl: string
  onClose: () => void
}

export const DownloadModal = defineComponent<DownloadModalProps>({
  setup(props) {
    const { t } = useI18n()

    return () => {
      return props.visible
        ? <div
            class={styles['download-modal-wrapper']}
            onClick={props.onClose}
          >
            <div class={styles['download-modal']} onClick={withModifiers(() => {}, ['stop'])}>
              <div class={styles['modal-body']}>
                <div class={styles['avatar-preview']}>
                  <img
                    alt="oh-my-avatar"
                    src={props.imageUrl}
                    class={styles['avatar-img']}
                  />
                </div>

                <p class={styles.tip}>{ t('text.downloadTip') } 🥳</p>
              </div>

              <button type="button" class={styles['close-btn']} onClick={props.onClose}>
                { t('action.close') }
              </button>
            </div>
          </div>
        : null
    }
  },
})

DownloadModal.props = ['visible', 'imageUrl', 'onClose']
