import PerfectScrollbar from 'perfect-scrollbar'

interface ScrollbarProps {
  options?: PerfectScrollbar.Options
}

export const Scrollbar = defineComponent<ScrollbarProps>({
  setup(props, { slots }) {
    const refScrollWrapper = ref<HTMLDivElement>()
    let ps: PerfectScrollbar

    onMounted(() => {
      if (!refScrollWrapper.value) {
        console.warn('No valid \'PerfectScrollbar\' container found')
        return
      }

      ps = new PerfectScrollbar(refScrollWrapper.value, {
        minScrollbarLength: 20,
        maxScrollbarLength: 160,
        ...props.options,
      })
    })

    onUnmounted(() => {
      ps.destroy()
    })

    return () => {
      return (
        <div ref={refScrollWrapper} class={['relative', 'of-hidden']}>
          {slots.default?.()}
        </div>
      )
    }
  },
})

Scrollbar.props = ['options']
