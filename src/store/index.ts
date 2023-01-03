import { WrapperShape } from '~/enums'
import type { AvatarOption } from '~/types'
import { getRandomAvatarOption } from '~/utils'
import { SCREEN } from '~/utils/constant'

export interface History {
  past: AvatarOption[]
  present: AvatarOption
  future: AvatarOption[]
}

export const useStore = defineStore(
  'store',
  () => {
    const history = ref<History>({
      past: [],
      present: getRandomAvatarOption({ wrapperShape: WrapperShape.Squircle }),
      future: [],
    })
    const isSiderCollapsed = ref(window.innerWidth <= SCREEN.lg)

    return {
      history,
      isSiderCollapsed,
      setAvatarOption(data: AvatarOption) {
        const { past, present } = history.value
        history.value = {
          past: [...past, present],
          present: data,
          future: [],
        }
      },
      undo() {
        const { value: _history } = history
        if (!_history.past.length) return
        const previous = _history.past[_history.past.length - 1]
        const newPast = _history.past.slice(
          0,
          _history.past.length - 1,
        )
        history.value = {
          past: newPast,
          present: previous,
          future: [_history.present, ..._history.future],
        }
      },
      redo() {
        const { value: _history } = history
        if (!_history.future.length) return
        const next = _history.future[0]
        const newFuture = _history.future.slice(1)
        history.value = {
          past: [..._history.past, _history.present],
          present: next,
          future: newFuture,
        }
      },
      setSiderStatus(status: boolean) {
        if (isSiderCollapsed.value !== status) {
          isSiderCollapsed.value = status
        }
      },
    }
  },
  {
    persist: {
      enabled: true,
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}

