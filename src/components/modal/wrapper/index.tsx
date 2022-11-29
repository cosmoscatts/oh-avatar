import { withModifiers } from 'vue'
import styles from './index.module.less'

interface ModalWrapperProps {
  visible?: boolean
}

export const ModalWrapper = defineComponent<ModalWrapperProps>({
  emits: ['close'],
  setup({ visible = false }, { emit }) {
    return () => {
      return (
        <transition name="fade">
          {
            visible
              ? <div class={styles.modal} onClick={withModifiers(() => emit('close'), ['self'])}>
                  <slot />
                </div>
              : <></>
          }
        </transition>
      )
    }
  },
})
