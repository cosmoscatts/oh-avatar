export function useSider() {
  const store = useStore()
  return {
    isCollapsed: computed(() => store.isSiderCollapsed),
    openSider: () => store.setSiderStatus(false),
    closeSider: () => store.setSiderStatus(true),
  }
}
