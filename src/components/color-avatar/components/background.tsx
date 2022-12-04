import type { AvatarOption } from '~/types'

interface BackgroundProps {
  color: AvatarOption['background']['color']
}

export const Background = defineComponent<BackgroundProps>({
  setup(props) {
    const classNames = [
      'absolute',
      'top-0',
      'left-0',
      'wfull',
      'hfull',
    ]
    const _style = computed(() => ({
      background: props.color,
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
