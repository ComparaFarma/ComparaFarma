export default defineI18nConfig(() => ({
  legacy: false,
  locale: "pt-br",
  messages: {
    "pt-br": {
      welcome: "Bem-vindo",
      home: "Início",
      login: "Entrar",
      logout: "Sair",
      signup: "Cadastrar",
      profile: "Perfil",
      email: "E-mail",
      supabaseCodes: {
        validation_failed: "Credenciais inválidas",
        user_already_exists: "Usuário já existe",
        weak_password: "Senha fraca",
        user_not_found: "Usuário não encontrado",
        email_exists: "E-mail já cadastrado",
        email_not_verified: "E-mail não verificado",
        email_provider_disabled: "Provedor de e-mail desativado",
      }
    },
  },
}));
