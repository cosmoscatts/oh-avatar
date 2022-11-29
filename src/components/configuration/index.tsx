import styles from './index.module.less'
import {
  type WidgetShape,
  type WrapperShape,
  BeardShape,
  WidgetType,
} from '~/enums'
import { AVATAR_LAYER, SETTINGS } from '~/utils/constant'
import { previewData } from '~/utils/dynamic-data'

export const Configuration = defineComponent({
  setup() {
    const { t } = useI18n()

    const [avatarOption, setAvatarOption] = useAvatarOption()
    
    const sectionList = reactive(Object.values(WidgetType))
    const sections = ref<
      {
        widgetType: WidgetType
        widgetList: {
          widgetType: WidgetType
          widgetShape: WidgetShape
          svgRaw: string
        }[]
      }[]
    >([])
    
    onMounted(() => {
      void (async () => {
        const a = await Promise.all(
          sectionList.map((section) => {
            return getWidgets(section)
          })
        )
    
        sections.value = sectionList.map((li, i) => {
          return {
            widgetType: li,
            widgetList: a[i],
          }
        })
      })()
    })
    
    async function getWidgets(widgetType: WidgetType) {
      const list = SETTINGS[`${widgetType}Shape`]
      const promises: Promise<string>[] = list.map(async (widget: string) => {
        if (widget !== 'none' && previewData?.[widgetType]?.[widget]) {
          return (await previewData[widgetType][widget]()).default
        }
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
      if (wrapperShape !== avatarOption.value.wrapperShape) {
        setAvatarOption({ ...avatarOption.value, wrapperShape })
      }
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
                ? { zIndex: AVATAR_LAYER['mouth'].zIndex - 1 }
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
      if (type === WidgetType.Tops || type === WidgetType.Clothes) {
        return avatarOption.value.widgets[type]?.fillColor
      } else return ''
    }

    const 

    return () => {
      return (
  <PerfectScrollbar class={styles['configurator-scroll']}>
    <div class={styles.configurator}>
      <SectionWrapper title={t('label.wrapperShape')}>
        <ul class={styles['wrapper-shape']}>
          <li
            v-for="wrapperShape in SETTINGS.wrapperShape"
            :key="wrapperShape"
            class="wrapper-shape__item"
            :title="t(`wrapperShape.${wrapperShape}`)"
            @click="switchWrapperShape(wrapperShape)"
          >
            <div
              class="shape"
              :class="[
                wrapperShape,
                { active: wrapperShape === avatarOption.wrapperShape },
              ]"
            />
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper :title="t('label.backgroundColor')">
        <ul class="color-list">
          <li
            v-for="bgColor in SETTINGS.backgroundColor"
            :key="bgColor"
            class="color-list__item"
            @click="switchBgColor(bgColor)"
          >
            <div
              :style="{ background: bgColor }"
              class="bg-color"
              :class="{
                active: bgColor === avatarOption.background.color,
                transparent: bgColor === 'transparent',
              }"
            ></div>
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper
        v-for="s in sections"
        :key="s.widgetType"
        :title="t(`widgetType.${s.widgetType}`)"
      >
        <details
          v-if="
            s.widgetType === WidgetType.Tops ||
            s.widgetType === WidgetType.Clothes
          "
          class="color-picker"
        >
          <summary class="color">{{ t('label.colors') }}</summary>
          <ul class="color-list">
            <li
              v-for="fillColor in SETTINGS.commonColors"
              :key="fillColor"
              class="color-list__item"
              @click="setWidgetColor(s.widgetType, fillColor)"
            >
              <div
                :style="{ background: fillColor }"
                class="bg-color"
                :class="{
                  active: fillColor === getWidgetColor(s.widgetType),
                }"
              />
            </li>
          </ul>
        </details>

        <ul class="widget-list">
          <li
            v-for="it in s.widgetList"
            :key="it.widgetShape"
            class="list-item"
            :class="{
              selected:
                it.widgetShape === avatarOption.widgets?.[s.widgetType]?.shape,
            }"
            @click="switchWidget(s.widgetType, it.widgetShape)"
            v-html="it.svgRaw"
          />
        </ul>
      </SectionWrapper>
    </div>
  </PerfectScrollbar>
      )
    }
  },
})
