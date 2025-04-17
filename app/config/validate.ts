import { defineRule, configure } from "vee-validate";
import { confirmed, email, required } from "@vee-validate/rules";
import { localize } from "@vee-validate/i18n";

export default () => {
  // Define the rule globally
  defineRule("required", required);
  defineRule("email", email);
  defineRule("confirmed", confirmed);

  configure({
    // Generates an English message locale generator
    generateMessage: localize("pt-BR", {
      messages: {
        required: "O campo {field} é obrigatório",
        email: "O campo {field} precisa ser um e-mail válido",
        confirmed: "Os campos não são iguais",
      },
    }),
  });
};
