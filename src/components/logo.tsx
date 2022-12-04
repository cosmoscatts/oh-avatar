import LogoSvg from '~/assets/logo.svg'

interface LogoProps {
  size?: number
}

export const Logo = defineComponent<LogoProps>({
  setup(props) {
    const _style = computed(() => ({
      width: `${props.size}rem`,
      height: `${props.size}rem`,
    }))

    return () => {
      return (
        <img
          class={['w40px', 'h40px']}
          src={LogoSvg}
          style={_style.value}
          alt="logo"
        />
      )
    }
  },
})

Logo.props = ['size']
