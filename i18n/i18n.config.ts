import ptBR from "./pt-BR/messages";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "pt-BR",
  messages: {
    "pt-BR": ptBR,
  },
  numberFormats: {
    "pt-BR": {
      currency: {
        style: 'currency', currency: 'BRL', currencyDisplay: 'symbol', minimumFractionDigits: 2, maximumFractionDigits: 2
      },
      decimal: {
        style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2
      },
      percent: {
        style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2
      }
    }
  }
}));
