import type { ThemeDefinition } from 'vuetify'
import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'
import { pt } from 'vuetify/locale'
import ptBR from './i18n/pt-BR/messages'

const customLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#0055A5',
    secondary: '#D32F2F',
    accent: '#FF4081',
    error: '#FF5252',
    info: '#0277BD',
    success: '#388E3C',
    warning: '#FFA000',
  },
}
export default defineVuetifyConfiguration({
  // your Vuetify options here
  theme: {
    defaultTheme: 'customLightTheme',
    themes: {
      customLightTheme
    }
  },
  locale: {
    locale: 'pt-BR',
    fallback: 'pt',
    messages: {
      pt, ptBR
    }
  },
  defaults: {
    VTextField: {
      variant: 'outlined',
      color: 'primary',
    },
    VSelect: {
      variant: 'outlined',
      color: 'primary',
    },
    VBtn: {
      flat: true,
    }
  }
})
