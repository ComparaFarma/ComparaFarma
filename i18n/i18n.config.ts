export default defineI18nConfig(() => ({
  legacy: false,
  locale: "pt-br",
  messages: {
    "pt-br": {
      welcome: "Bem-vindo",
      home: "Início",
      logout: "Sair",
      signup: "Cadastrar",
      profile: "Perfil",
      supabaseCodes: {
        validation_failed: "Credenciais inválidas",
        user_already_exists: "Usuário já existe",
        weak_password: "Senha fraca",
        user_not_found: "Usuário não encontrado",
        email_exists: "E-mail já cadastrado",
        email_not_verified: "E-mail não verificado",
        email_provider_disabled: "Provedor de e-mail desativado",
      },
      text: {
        loginScreen: {
          login: "Entrar",
          title: "Entrar no Compara Farma",
          forgotPasswordLink: "Clique aqui",
          forgotPassword: "Esqueceu sua senha?",
        },
        requestPasswordScreen: {
          title: "Recuperar senha",
          button: "Enviar e-mail",
        },
        resetPasswordScreen: {
          title: "Redefinir senha",
          button: "Redefinir senha",
        }
      },
      actions: {
        backToLogin: "Voltar para o login",
      },
      words: {
        email: "E-mail",
        password: "Senha",
        passwordConfirmation: "Confirmar senha",
      }
    },
  },
}));
