<template>
  <div class="ga-3 d-flex flex-column">
    <h4 class="text-h4 text-primary font-weight-black text-center">
      {{ $t("text.loginScreen.title") }}
    </h4>
    <v-form @submit.prevent="submit">
      <v-text-field
        v-model="email"
        :label="$t('words.email')"
        type="email"
        autocomplete="email"
        v-bind="emailProps"
      />
      <v-text-field
        v-model="password"
        :label="$t('words.password')"
        type="password"
        autocomplete="current-password"
        v-bind="passwordProps"
      />
      <v-btn
        v-t="'text.loginScreen.login'"
        size="large"
        color="primary"
        block
        type="submit"
        :loading="loading"
      />
    </v-form>
    <span>
      {{ $t("text.loginScreen.forgotPassword") }}
      <v-btn
        :text="$t('text.loginScreen.forgotPasswordLink')"
        class="text-primary text-capitalize"
        variant="text"
        slim
        :disabled="loading"
        :ripple="false"
        href="/auth/requestPassword"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import auth from "~/ middleware/auth";
import { useForm } from "vee-validate";
import { useNotifyStore } from "~/store/notifyStore";
definePageMeta({
  middleware: auth,
  layout: "login-layout",
});

const supabase = useSupabaseClient();

const { defineField, handleSubmit } = useForm({
  validationSchema: {
    email: "required|email",
    password: "required",
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const vuetifyConfig = (state: any) => ({
  props: {
    "error-messages": state.errors,
  },
});

const [email, emailProps] = defineField("email", vuetifyConfig);
const [password, passwordProps] = defineField("password", vuetifyConfig);

const i18n = useI18n();
const notifyStore = useNotifyStore();
const loading = ref(false);

const submit = handleSubmit(async (values) => {
  console.log(values);
  loading.value = true;
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  loading.value = false;
  if (!error) {
    navigateTo("/");
    return;
  }
  notifyStore.showNotification(
    i18n.te("supabaseCodes." + error.code)
      ? i18n.t("supabaseCodes." + error.code)
      : error.message,
    'error',
  );
});

</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
