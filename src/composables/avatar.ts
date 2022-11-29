import type { AvatarOption } from '~/types'

export function useAvatarOption() {
  const store = useStore()
  const avatarOption = computed(() => store.history.present)
  const setAvatarOption = (newOption: AvatarOption) => store.setAvatarOption(newOption)

  return [avatarOption, setAvatarOption] as const
}
