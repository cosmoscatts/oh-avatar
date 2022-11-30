import { Transition, withModifiers } from 'vue'
import styles from './index.module.less'

interface ModalWrapperProps {
  visible?: boolean
  onClose: () => void
}

export const ModalWrapper = defineComponent<ModalWrapperProps>({
  setup({ visible = false, onClose }, { slots }) {
    return () => {
      return (
        <Transition name="fade">
          {
            visible
              ? <div class={styles.modal} onClick={withModifiers(onClose, ['self'])}>
                  {slots.default?.()}
                </div>
              : null
          }
        </Transition>
      )
    }
  },
})

ModalWrapper.props = ['visible', 'onClose']
