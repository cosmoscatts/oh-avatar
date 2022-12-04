import { Transition, withModifiers } from 'vue'
import styles from './index.module.less'

interface ModalWrapperProps {
  visible?: boolean
  onClose: () => void
}

export const ModalWrapper = defineComponent<ModalWrapperProps>({
  setup(props, { slots }) {
    return () => {
      return (
        <Transition name="fade">
          {
            props.visible
              ? <div class={styles.modal} onClick={withModifiers(props.onClose, ['self'])}>
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
