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
  setup({ id, option = getRandomAvatarOption(), size = 280 }) {
    const refAvatar = ref<HTMLDivElement>()

    function getWrapperShapeClassName() {
      return {
        [WrapperShape.Circle]:
        option.wrapperShape === WrapperShape.Circle,
        [WrapperShape.Square]:
          option.wrapperShape === WrapperShape.Square,
        [WrapperShape.Squircle]:
          option.wrapperShape === WrapperShape.Squircle,
      }
    }

    const svgContent = ref('')

    watchEffect(async () => {
      const sortedList = Object.entries(option.widgets).sort(
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
            <g id="vue-color-avatar-${sortedList[i][0]}">
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
    })

    return () => {
      return (
        <div
          ref={refAvatar}
          id={id}
          class={[styles['color-avatar'], getWrapperShapeClassName()]}
          style={{
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          <Background color={option.background.color} />
          <div class={styles['avatar-payload']} v-html={svgContent} />
        </div>
      )
    }
  },
})
