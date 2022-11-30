import PerfectScrollbar from 'perfect-scrollbar'

interface ScrollbarProps {
  options?: PerfectScrollbar.Options
}

export const Scrollbar = defineComponent<ScrollbarProps>({
  setup({ options }, { slots }) {
    return () => {
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
          ...options,
        })
      })

      onUnmounted(() => {
        ps.destroy()
      })

      return (
        <div ref={refScrollWrapper} class={['relative', 'of-hidden']}>
          {slots.default?.() ?? null}
        </div>
      )
    }
  },
})

