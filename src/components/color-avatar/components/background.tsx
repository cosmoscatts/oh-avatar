import type { ComputedRef } from 'vue'
import type { AvatarOption } from '~/types'

interface BackgroundProps {
  color: ComputedRef<AvatarOption['background']['color']>
}

export const Background = defineComponent<BackgroundProps>({
  setup({ color }) {
    const classNames = [
      'absolute',
      'top-0',
      'left-0',
      'wfull',
      'hfull',
    ]
    const _style = computed(() => ({
      background: color.value,
      transition: 'background-color 0.1s',
    }))
    return () => {
      return (
        <div class={classNames} style={_style.value}></div>
      )
    }
  },
})

Background.props = ['color']
