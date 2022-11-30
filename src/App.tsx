import { name as appName } from '../package.json'
import styles from '~/styles/app.module.less'
import { ActionBar } from '~/components/action-bar'
import { Configuration } from '~/components/configuration'
import { BatchDownloadModal } from '~/components/modal/batch-download'
import { CodeModal } from '~/components/modal/code'
import { DownloadModal } from '~/components/modal/download'
import { ColorAvatar } from '~/components/color-avatar'
import { ActionType } from '~/enums'
import {
  Container,
  Footer,
  Header,
  Sider,
} from '~/layout'
import {
  getRandomAvatarOption,
  getSpecialAvatarOption,
  showConfetti,
} from '~/utils'
import {
  DOWNLOAD_DELAY,
  NOT_COMPATIBLE_AGENTS,
  TRIGGER_PROBABILITY,
} from '~/utils/constant'
import { recordEvent } from '~/utils/ga'

import { Confetti } from '~/components/confetti'
import type { AvatarOption } from '~/types'

const App = defineComponent({
  setup() {
    const store = useStore()
    const [avatarOption, setAvatarOption] = useAvatarOption()

    const { t } = useI18n()

    const refColorAvatar = ref()

    function handleGenerate() {
      if (Math.random() <= TRIGGER_PROBABILITY) {
        let colorfulOption = getSpecialAvatarOption()
        while (
          JSON.stringify(colorfulOption) === JSON.stringify(avatarOption.value)
        )
          colorfulOption = getSpecialAvatarOption()

        colorfulOption.wrapperShape = avatarOption.value.wrapperShape
        setAvatarOption(colorfulOption)
        showConfetti()
      }
      else {
        const randomOption = getRandomAvatarOption(avatarOption.value)
        setAvatarOption(randomOption)
      }

      recordEvent('click_randomize', {
        event_category: 'click',
      })
    }

    const downloadModalVisible = ref(false)
    const downloading = ref(false)
    const imageDataURL = ref('')

    async function handleDownload() {
      try {
        downloading.value = true
        const avatarEle = refColorAvatar.value?.refAvatar

        const userAgent = window.navigator.userAgent.toLowerCase()
        const notCompatible = NOT_COMPATIBLE_AGENTS.some(
          agent => userAgent.includes(agent),
        )

        if (avatarEle) {
          const html2canvas = (await import('html2canvas')).default
          const canvas = await html2canvas(avatarEle, {
            backgroundColor: null,
          })
          const dataURL = canvas.toDataURL()

          if (notCompatible) {
            imageDataURL.value = dataURL
            downloadModalVisible.value = true
          }
          else {
            const trigger = document.createElement('a')
            trigger.href = dataURL
            trigger.download = `${appName}.png`
            trigger.click()
          }
        }

        recordEvent('click_download', {
          event_category: 'click',
        })
      }
      finally {
        setTimeout(() => {
          downloading.value = false
        }, DOWNLOAD_DELAY)
      }
    }

    const flipped = ref(false)
    const codeVisible = ref(false)

    function handleAction(actionType: ActionType) {
      switch (actionType) {
        case ActionType.Undo:
          store.undo()
          recordEvent('action_undo', {
            event_category: 'action',
            event_label: 'Undo',
          })
          break

        case ActionType.Redo:
          store.redo()
          recordEvent('action_redo', {
            event_category: 'action',
            event_label: 'Redo',
          })
          break

        case ActionType.Flip:
          flipped.value = !flipped.value
          recordEvent('action_flip_avatar', {
            event_category: 'action',
            event_label: 'Flip Avatar',
          })
          break

        case ActionType.Code:
          codeVisible.value = !codeVisible.value
          recordEvent('action_view_code', {
            event_category: 'action',
            event_label: 'View Avatar Option Code',
          })
          break
      }
    }

    const avatarListVisible = ref(false)
    const avatarList = ref<AvatarOption[]>([])

    watchEffect(() => {
      avatarListVisible.value
        = Array.isArray(avatarList.value) && avatarList.value?.length > 0
    })

    async function generateMultiple(count = 5 * 6) {
      const { default: hash } = await import('object-hash')

      const avatarMap = [...Array(count)].reduce<Map<string, AvatarOption>>(
        (res) => {
          let randomAvatarOption: AvatarOption
          let hashKey: string

          do {
            randomAvatarOption = getRandomAvatarOption(avatarOption.value)
            hashKey = hash.sha1(randomAvatarOption as any)
          } while (
            randomAvatarOption.background.color === 'transparent'
            || res.has(hashKey)
          )

          res.set(hashKey, randomAvatarOption)

          return res
        },
        new Map(),
      )

      avatarList.value = Array.from(avatarMap.values())

      recordEvent('click_generate_multiple', {
        event_category: 'click',
      })
    }
    return () => {
      return (
        <main class={styles.main}>
          <Container>
            {
              () => (
                <div class={styles['content-warpper']}>
                  <div class={styles['content-view']}>
                    <Header />

                    <div class={styles.playground}>
                      <div class={styles['avatar-wrapper']}>
                        <ColorAvatar
                          ref={refColorAvatar}
                          option={avatarOption}
                          size={280}
                          style={{
                            transform: `rotateY(${flipped.value ? -180 : 0}deg)`,
                          }}
                        />
                      </div>

                      <ActionBar onAction={handleAction} />

                      <div class={styles['action-group']}>
                        <button
                          type="button"
                          class={[styles['action-btn'], styles['action-randomize']]}
                          onClick={handleGenerate}
                        >
                          {t('action.randomize')}
                        </button>

                        <button
                          type="button"
                          class={[styles['action-btn'], styles['action-download']]}
                          disabled={downloading.value}
                          onClick={handleDownload}
                        >
                          {
                            downloading.value
                              ? `${t('action.downloading')}...`
                              : t('action.download')
                          }
                        </button>

                        <button
                          type="button"
                          class={[styles['action-btn'], styles['action-multiple']]}
                          onClick={() => generateMultiple(undefined)}
                        >
                          {t('action.downloadMultiple')}
                        </button>
                      </div>
                    </div>

                    <Footer />

                    <CodeModal visible={codeVisible} onClose={() => codeVisible.value = false} />

                    <DownloadModal
                      visible={downloadModalVisible}
                      imageUrl={imageDataURL.value}
                      onClose={() => {
                        downloadModalVisible.value = false
                        imageDataURL.value = ''
                      }}
                    />
                  </div>

                  <Confetti />

                  <div class={styles['gradient-bg']}>
                    <div class={styles['gradient-top']}></div>
                    <div class={styles['gradient-bottom']}></div>
                  </div>
                </div>
              )
            }
          </Container>

          <BatchDownloadModal
            visible={avatarListVisible}
            avatar-list={avatarList}
            onRegenerate={() => generateMultiple()}
            onClose={() => {
              avatarListVisible.value = false
              avatarList.value = []
            }}
          />

          <Sider>
            {() => (<Configuration />)}
          </Sider>
        </main>
      )
    }
  },
})

export default App
