export const Confetti = defineComponent({
  setup() {
    return () => {
      return (
        <canvas
          id="confetti"
          class={['absolute', 'top-0', 'left-0', 'w-full', 'h-full']}
        ></canvas>
      )
    }
  },
})
