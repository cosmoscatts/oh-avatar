import { Transition, withModifiers } from 'vue'
import styles from './index.module.less'

interface ModalWrapperProps {
  visible?: boolean
  onClose: () => void
}

export const ModalWrapper = defineComponent<ModalWrapperProps>({
  setup({ visible = false, onClose }) {
    return () => {
      return (
        <Transition name="fade">
          {
            visible
              ? <div class={styles.modal} onClick={withModifiers(onClose, ['self'])}>
                  <slot />
                </div>
              : <></>
          }
        </Transition>
      )
    }
  },
})
