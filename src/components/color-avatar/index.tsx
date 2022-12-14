import styles from './index.module.less'
import { Background } from './components/background'
import { WrapperShape } from '~/enums'
import type { AvatarOption } from '~/types'
import { getRandomAvatarOption } from '~/utils'
import { AVATAR_LAYER, NONE } from '~/utils/constant'
import { widgetData } from '~/utils/dynamic-data'

interface ColorAvatarProps {
  id?: string
  option: AvatarOption
  size?: number
}

export const ColorAvatar = defineComponent<ColorAvatarProps>({
  setup(props, { expose }) {
    const refAvatar = ref<HTMLDivElement>()
    expose({ refAvatar })

    const option = computed(() => props.option ?? getRandomAvatarOption())
    function getWrapperShapeClassName() {
      if (!option.value.wrapperShape) return ''
      return {
        [WrapperShape.Circle]: WrapperShape.Circle,
        [WrapperShape.Square]: WrapperShape.Square,
        [WrapperShape.Squircle]: WrapperShape.Squircle,
      }[option.value.wrapperShape]
    }

    const svgContent = ref('')

    async function createAvatar() {
      const { size = 280 } = props
      const { value: _option } = option
      const sortedList = Object.entries(_option.widgets).sort(
        ([prevShape, prev], [nextShape, next]) => {
          const ix = prev.zIndex ?? AVATAR_LAYER[prevShape]?.zIndex ?? 0
          const iix = next.zIndex ?? AVATAR_LAYER[nextShape]?.zIndex ?? 0
          return ix - iix
        },
      )

      const promises: Promise<string>[] = sortedList.map(
        async ([widgetType, opt]) => {
          if (opt.shape !== NONE && widgetData?.[widgetType]?.[opt.shape])
            return (await widgetData[widgetType][opt.shape]()).default

          return ''
        },
      )

      const svgRawList = await Promise.all(promises).then((raw) => {
        return raw.map((svgRaw, i) => {
          const widgetFillColor = sortedList[i][1].fillColor

          const content = svgRaw
            .slice(svgRaw.indexOf('>', svgRaw.indexOf('<svg')) + 1)
            .replace('</svg>', '')
            .replaceAll('$fillColor', widgetFillColor || 'transparent')

          return `
            <g id="color-avatar-${sortedList[i][0]}">
              ${content}
            </g>
          `
        })
      })

      svgContent.value = `
        <svg
          width="${size}"
          height="${size}"
          viewBox="0 0 ${size / 0.7} ${size / 0.7}"
          preserveAspectRatio="xMidYMax meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(100, 65)">
            ${svgRawList.join('')}
          </g>
        </svg>
      `
    }
    createAvatar()

    watch(() => props.option, createAvatar, { deep: true })

    return () => {
      return (
        <div
          ref={refAvatar}
          id={props.id}
          class={{
            [styles['color-avatar']]: true,
            [styles[getWrapperShapeClassName()]]: true,
          }}
          style={{
            width: `${props.size}px`,
            height: `${props.size}px`,
          }}
        >
          <Background color={props.option.background.color} />
          <div class={styles['avatar-payload']} v-html={svgContent.value} />
        </div>
      )
    }
  },
})

ColorAvatar.props = ['id', 'option', 'size']
