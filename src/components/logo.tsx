import LogoSvg from '~/assets/logo.svg'

interface LogoProps {
  size?: number
}

export const Logo = defineComponent<LogoProps>({
  setup({ size = 2.5 }) {
    const _style = computed(() => ({
      width: `${size}rem`,
      height: `${size}rem`,
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

