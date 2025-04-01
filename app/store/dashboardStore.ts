import { defineStore } from 'pinia'

export enum BottomNavigationType {
    MY_SEARCHES = 'MY_SEARCHES',
    CREATE_SEARCH = 'CREATE_SEARCH',
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
      currentBottomSheet: ref<BottomNavigationType | null>(BottomNavigationType.MY_SEARCHES),
  }),
  actions: {
        openBottomSheet(type: BottomNavigationType) {
            this.currentBottomSheet = type
        },
        closeBottomSheet() {
            this.currentBottomSheet = null
        },
  }
})