import styles from './index.module.less'
import {
  BeardShape,
  type WidgetShape,
  WidgetType,
  type WrapperShape,
} from '~/enums'
import { AVATAR_LAYER, SETTINGS } from '~/utils/constant'
import { previewData } from '~/utils/dynamic-data'
import { SectionWrapper } from '~/components/section-wrapper'
import { Scrollbar } from '~/components/scrollbar'

interface Section {
  widgetType: WidgetType
  widgetList: {
    widgetType: WidgetType
    widgetShape: WidgetShape
    svgRaw: string
  }[]
}

export const Configuration = defineComponent({
  setup() {
    const { t } = useI18n()

    const [avatarOption, setAvatarOption] = useAvatarOption()

    const sectionList = reactive(Object.values(WidgetType))
    const sections = ref<Section[]>([])

    onMounted(async () => {
      const a = await Promise.all(sectionList.map(section => getWidgets(section)))
      sections.value = sectionList.map((li, i) => {
        return {
          widgetType: li,
          widgetList: a[i],
        }
      })
    })

    async function getWidgets(widgetType: WidgetType) {
      const list = SETTINGS[`${widgetType}Shape`]
      const promises: Promise<string>[] = list.map(async (widget: string) => {
        if (widget !== 'none' && previewData?.[widgetType]?.[widget])
          return (await previewData[widgetType][widget]()).default

        return 'X'
      })
      const svgRawList = await Promise.all(promises).then((raw) => {
        return raw.map((svgRaw, i) => {
          return {
            widgetType,
            widgetShape: list[i],
            svgRaw,
          }
        })
      })
      return svgRawList
    }

    function switchWrapperShape(wrapperShape: WrapperShape) {
      if (wrapperShape !== avatarOption.value.wrapperShape)
        setAvatarOption({ ...avatarOption.value, wrapperShape })
    }

    function switchBgColor(bgColor: string) {
      if (bgColor !== avatarOption.value.background.color) {
        setAvatarOption({
          ...avatarOption.value,
          background: { ...avatarOption.value.background, color: bgColor },
        })
      }
    }

    function switchWidget(widgetType: WidgetType, widgetShape: WidgetShape) {
      if (widgetShape && avatarOption.value.widgets?.[widgetType]) {
        setAvatarOption({
          ...avatarOption.value,
          widgets: {
            ...avatarOption.value.widgets,
            [widgetType]: {
              ...avatarOption.value.widgets?.[widgetType],
              shape: widgetShape,
              ...(widgetShape === BeardShape.Scruff
                ? { zIndex: AVATAR_LAYER.mouth.zIndex - 1 }
                : undefined),
            },
          },
        })
      }
    }

    function setWidgetColor(widgetType: WidgetType, fillColor: string) {
      if (avatarOption.value.widgets?.[widgetType]) {
        setAvatarOption({
          ...avatarOption.value,
          widgets: {
            ...avatarOption.value.widgets,
            [widgetType]: {
              ...avatarOption.value.widgets?.[widgetType],
              fillColor,
            },
          },
        })
      }
    }

    function getWidgetColor(type: string) {
      if (type === WidgetType.Tops || type === WidgetType.Clothes)
        return avatarOption.value.widgets[type]?.fillColor

      else return ''
    }

    const _c = (s: Section) => ((s.widgetType === WidgetType.Tops
      || s.widgetType === WidgetType.Clothes)
      ? (
          <details
            class={styles['color-picker']}
          >
            <summary class={styles.color}>{t('label.colors')}</summary>
            <ul class={styles['color-list']}>
              {
                SETTINGS.commonColors.map(fillColor => (
                  <li
                    key={fillColor}
                    class={styles['color-list__item']}
                    onClick={() => setWidgetColor(s.widgetType, fillColor)}
                  >
                    <div
                      style={{ background: fillColor }}
                      class={{
                        [styles['bg-color']]: true,
                        [styles.active]: fillColor === getWidgetColor(s.widgetType),
                      }}
                    />
                  </li>
                ))
              }
            </ul>
          </details>
        )
      : null)

    const render = (s: Section) => {
      return (
        <>
          { _c(s) }
          <ul class={styles['widget-list']}>
            {
              s.widgetList.map(it => (
                <li
                  key={it.widgetShape}
                  class={{
                    [styles['list-item']]: true,
                    [styles.selected]:
                      it.widgetShape === avatarOption.value.widgets?.[s.widgetType]?.shape,
                  }}
                  onClick={() => switchWidget(s.widgetType, it.widgetShape)}
                  v-html={it.svgRaw}
                />
              ))
            }
          </ul>
        </>
      )
    }

    return () => {
      return (
        <Scrollbar class={styles['configuration-scroll']}>
          {
            () => (
              <div class={styles.configuration}>
                <SectionWrapper title={t('label.wrapperShape')}>
                  {
                    () => (
                      <ul class={styles['wrapper-shape']}>
                        {
                          SETTINGS.wrapperShape.map(wrapperShape => (
                            <li
                              key={wrapperShape}
                              class={styles['wrapper-shape__item']}
                              title={t(`wrapperShape.${wrapperShape}`)}
                              onClick={() => switchWrapperShape(wrapperShape)}
                            >
                              <div
                                class={[styles.shape, styles[wrapperShape], ['', styles.active][Number(wrapperShape === avatarOption.value.wrapperShape)]]}
                              />
                            </li>
                          ))
                        }
                      </ul>
                    )
                  }
                </SectionWrapper>

                <SectionWrapper title={t('label.backgroundColor')}>
                  {() => (
                    <ul class={styles['color-list']}>
                      {
                        SETTINGS.backgroundColor?.map(bgColor => (
                          <li
                            key={bgColor}
                            class={styles['color-list__item']}
                            onClick={() => switchBgColor(bgColor)}
                          >
                            <div
                              style={{ background: bgColor }}
                              class={{
                                [styles['bg-color']]: true,
                                [styles.active]: bgColor === avatarOption.value.background.color,
                                [styles.transparent]: bgColor === 'transparent',
                              }}
                            ></div>
                          </li>
                        ))
                      }
                    </ul>
                  )}
                </SectionWrapper>

                {
                  sections.value?.map(s => (
                    <SectionWrapper
                      key={s.widgetType}
                      title={t(`widgetType.${s.widgetType}`)}
                    >
                      {() => render(s)}
                    </SectionWrapper>
                  ))
                }
              </div>
            )
          }
        </Scrollbar>
      )
    }
  },
})
