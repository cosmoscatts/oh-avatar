import styles from './index.module.less'

import IconBack from '~/assets/icons/icon-back.svg'
import IconCode from '~/assets/icons/icon-code.svg'
import IconFlip from '~/assets/icons/icon-flip.svg'
import IconNext from '~/assets/icons/icon-next.svg'
import { ActionType } from '~/enums'

export const ActionBar = defineComponent({
  emits: ['action'],
  setup(_props, { emit }) {
    const { t } = useI18n()

    const store = useStore()

    const canUndo = computed(() => store.history.past.length > 0)
    const canRedo = computed(() => store.history.future.length > 0)

    const actions = computed(() => [
      {
        type: ActionType.Undo,
        icon: IconBack,
        tip: t('action.undo'),
        disabled: !canUndo.value,
      },
      {
        type: ActionType.Redo,
        icon: IconNext,
        tip: t('action.redo'),
        disabled: !canRedo.value,
      },
      {
        type: ActionType.Flip,
        icon: IconFlip,
        tip: t('action.flip'),
      },
      {
        type: ActionType.Code,
        icon: IconCode,
        tip: t('action.code'),
      },
    ])

    return () => {
      return (
        <div class={styles['action-menu']}>

          {
            actions.value.map(({ type, tip, disabled, icon }) => {
              return <div
                        key={type}
                        class={[styles['menu-item'], [styles['menu-item'], 'disabled']][Number(disabled)]}
                        title={tip}
                        onClick={() => emit('action', type)}
                      >
                        <img src={icon} alt={tip} />
                      </div>
            })
          }
        </div>
      )
    }
  },
})
