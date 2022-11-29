import { withModifiers } from 'vue'
import styles from './index.module.less'

interface DownloadModalProps {
  visible?: boolean
  imageUrl: string
}

export const DownloadModal = defineComponent<DownloadModalProps>({
  emits: ['close'],
  setup({ visible = false, imageUrl }, { emit }) {
    const { t } = useI18n()

    const _component = (
    <div
      class={styles['download-modal-wrapper']}
      onClick={() => emit('close')}
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

        <button type="button" class={styles['close-btn']} onClick={() => emit('close')}>
          { t('action.close') }
        </button>
      </div>
    </div>
    )

    return () => {
      return visible
        ? _component
        : <></>
    }
  },
})
