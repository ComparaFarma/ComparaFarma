import { defineStore } from 'pinia'


export const useNotifyStore = defineStore('notify', {
  state: () => ({
      messages: ref([]),
      type: 'success',
  } as {
        messages: Ref<string[]>,
        type: string
  }),
  actions: {
        showNotification(message: string, type: string = 'success') {
            this.messages.push(message)
            this.type = type
        }
  }
})