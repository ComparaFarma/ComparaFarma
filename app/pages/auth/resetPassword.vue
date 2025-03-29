<template>
  <div class="ga-3 d-flex flex-column">
    <h4 class="text-h4 text-primary font-weight-black text-center">
      {{ $t("text.resetPasswordScreen.title") }}
    </h4>
    <v-form @submit.prevent="resetPassword">
      <v-text-field
        key="password"
        v-model="password"
        :label="$t('words.password')"
        type="password"
        autocomplete="new-password"
        v-bind="passwordProps"
      />
      <v-text-field
        key="passwordConfirmation"
        v-model="passwordConfirmation"
        v-bind="passwordConfirmationProps"
        :label="$t('words.passwordConfirmation')"
        type="password"
        autocomplete="new-password"
      />
      <v-btn
        color="primary"
        type="submit"
        block
        size="large"
        :loading="loading"
      >
        {{ $t("text.resetPasswordScreen.button") }}
      </v-btn>
      <v-btn
        class="mt-3"
        :text="$t('actions.backToLogin')"
        block
        :ripple="false"
        :disabled="loading"
        href="/auth/login"
      />
    </v-form>
  </div>
</template>
<script setup lang="ts">
import { useNotifyStore } from "~/store/notifyStore";

definePageMeta({
  layout: "login-layout",
});
const route = useRoute();
onBeforeMount(() => {
  // check the query params
  if (route.fullPath.includes("access_denied")) {
    navigateTo("/auth/login");
  }
});

const supabase = useSupabaseClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const vuetifyConfig = (state: any) => ({
  props: {
    "error-messages": state.errors,
  },
});

const { defineField, handleSubmit } = useForm({
  validationSchema: {
    password: "required",
    passwordConfirmation: "required|confirmed:@password",
  },
});

const [password, passwordProps] = defineField("password", vuetifyConfig);
const [passwordConfirmation, passwordConfirmationProps] = defineField(
  "passwordConfirmation",
  vuetifyConfig
);

const i18n = useI18n();
const notifyStore = useNotifyStore();
const loading = ref(false);
const resetPassword = handleSubmit(async () => {
  loading.value = true;
  const { error } = await supabase.auth.updateUser({
    password: password.value,
  });
  loading.value = false;
  if (!error) {
    notifyStore.showNotification(
      i18n.t("text.resetPasswordScreen.success"),
      "success"
    );
    navigateTo("/auth/login");
    return;
  }
  notifyStore.showNotification(
    i18n.te("supabaseCodes." + error.code)
      ? i18n.t("supabaseCodes." + error.code)
      : error.message,
    "error"
  );
});
</script>
