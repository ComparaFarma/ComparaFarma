import type { ThemeDefinition } from 'vuetify'
import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

const customLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#0055A5',
    secondary: '#D32F2F',
    error: '#FF5252',
    info: '#0277BD',
    success: '#388E3C',
    warning: '#FFA000',
  },
}
export default defineVuetifyConfiguration({
  // your Vuetify options here
  theme: {
    defaultTheme: 'light',
    themes: {
      customLightTheme
    }
  },
})
