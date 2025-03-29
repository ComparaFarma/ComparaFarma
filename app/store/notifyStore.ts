import { defineStore } from 'pinia'


export const useNotifyStore = defineStore('notify', {
  state: () => ({
      show: false,
      message: '',
      type: 'success',
  }),
  actions: {
        showNotification(message: string, type: string = 'success') {
            this.show = true
            this.message = message
            this.type = type
        },
        hideNotification() {
            this.show = false
            this.message = ''
            this.type = 'success'
        },
  }
})