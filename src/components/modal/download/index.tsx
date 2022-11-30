import { withModifiers } from 'vue'
import styles from './index.module.less'

interface DownloadModalProps {
  visible?: boolean
  imageUrl: string
  onClose: () => void
}

export const DownloadModal = defineComponent<DownloadModalProps>({
  setup({ visible = false, imageUrl, onClose }) {
    const { t } = useI18n()

    return () => {
      return visible
        ? <div
            class={styles['download-modal-wrapper']}
            onClick={onClose}
          >
            <div class={styles['download-modal']} onClick={withModifiers(() => {}, ['stop'])}>
              <div class={styles['modal-body']}>
                <div class={styles['avatar-preview']}>
                  <img
                    alt="oh-my-avatar"
                    src={imageUrl}
                    class={styles['avatar-img']}
                  />
                </div>

                <p class={styles.tip}>{ t('text.downloadTip') } 🥳</p>
              </div>

              <button type="button" class={styles['close-btn']} onClick={onClose}>
                { t('action.close') }
              </button>
            </div>
          </div>
        : null
    }
  },
})
