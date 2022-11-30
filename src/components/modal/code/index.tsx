import type ClipboardJS from 'clipboard'
import { ModalWrapper } from '../wrapper'
import styles from './index.module.less'
import IconClose from '~/assets/icons/icon-close.svg'
import { Scrollbar } from '~/components/scrollbar'
import { highlightJSON } from '~/utils'

interface CodeModalProps {
  visible?: boolean
  onClose: () => void
}

export const CodeModal = defineComponent<CodeModalProps>({
  setup({ visible = false, onClose }) {
    const { t } = useI18n()

    const [avatarOption] = useAvatarOption()

    const codeJSON = computed(() => JSON.stringify(avatarOption.value, null, 4))

    const highlightedCode = ref('')

    watchEffect(() => {
      if (codeJSON.value)
        highlightedCode.value = highlightJSON(codeJSON.value)
    })

    const copied = ref(false)

    let clipboard: ClipboardJS

    onMounted(async () => {
      const { default: ClipboardJS } = await import('clipboard')
      clipboard = new ClipboardJS('#copy-code-btn')

      clipboard.on('success', (e) => {
        copied.value = true

        setTimeout(() => {
          copied.value = false
        }, 800)

        e.clearSelection()
      })
    })

    onUnmounted(() => {
      clipboard.destroy()
    })

    return () => {
      return (
        <ModalWrapper visible={visible} onClose={onClose}>
          {
            () => (
              <div class={styles['code-box']}>
                <div class={styles['code-header']}>
                  <div class={styles.title}>{ t('text.codeModalTitle') }</div>

                  <div class={styles['close-btn']} onClick={onClose}>
                    <img src={IconClose} class={styles['icon-close']} alt={t('action.close')} />
                  </div>
                </div>

                <div class={styles['code-content-box']}>
                  <Scrollbar
                    class={styles['code-scroll-wrapper']}
                    options={{ suppressScrollX: false }}
                  >
                    {
                      () => (
                        <pre><code class={styles['code-content']} v-html={highlightedCode}></code></pre>
                      )
                    }
                  </Scrollbar>

                  <button
                    id="copy-code-btn"
                    class={[styles['copy-btn'], ['', 'copied'][Number(copied.value)]]}
                    data-clipboard-text={codeJSON}
                  >
                    { copied ? t('action.copied') : t('action.copyCode') }
                  </button>
                </div>
              </div>
            )
          }
        </ModalWrapper>
      )
    }
  },
})

CodeModal.props = ['visible', 'onClose']
