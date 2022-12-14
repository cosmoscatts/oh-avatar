interface SectionWrapperProps {
  title?: string
}
export const SectionWrapper = defineComponent<SectionWrapperProps>({
  setup(props, { slots }) {
    return () => {
      return (
        <div class={['py-[1.8rem]', 'px-1rem']}>
          <div class={['mb-[1.5rem]', 'font-bold', 'lh-23px']}>{ props.title ?? '-' }</div>
          <div>
            {slots.default?.()}
          </div>
        </div>
      )
    }
  },
})

SectionWrapper.props = ['title']
