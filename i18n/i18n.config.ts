export default defineI18nConfig(() => ({
  legacy: false,
  locale: "pt-br",
  messages: {
    "pt-br": {
      APPLICATION_NAME: "Compara Farma",
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
        same_password: "A nova senha não pode ser a mesma que a antiga",
        email_provider_disabled: "Provedor de e-mail desativado",
        invalid_credentials: "Credenciais inválidas",
        over_email_send_rate_limit: "Por razões de segurança, você só poderá solicitar um e-mail de redefinição de senha daqui 28 segundos",
      },
      text: {
        loginScreen: {
          login: "Entrar",
          title: "Realizar Login",
          forgotPasswordLink: "Clique aqui",
          forgotPassword: "Esqueceu sua senha?",
        },
        requestPasswordScreen: {
          title: "Recuperar Senha",
          button: "Enviar e-mail",
          success: "E-mail enviado com sucesso",
        },
        resetPasswordScreen: {
          title: "Redefinir Senha",
          button: "Redefinir senha",
          success: "Senha redefinida com sucesso",
        },
        bottomNavigation: {
          mySearches: "Minhas Buscas",
          createSearch: "Novas Consultas",
        },
        appBar: {
          notification: "Notificações",
          logout: "Sair",
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
