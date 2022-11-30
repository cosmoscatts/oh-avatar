import { type Ref, Transition, withModifiers } from 'vue'
import styles from './index.module.less'

interface ModalWrapperProps {
  visible?: Ref<boolean>
  onClose: () => void
}

export const ModalWrapper = defineComponent<ModalWrapperProps>({
  setup({ visible = ref(false), onClose }, { slots }) {
    return () => {
      return (
        <Transition name="fade">
          {
            visible.value
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
