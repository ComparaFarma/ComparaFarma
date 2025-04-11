<template>
  <div class="ga-3 d-flex flex-column">
    <h4 class="text-h4 text-primary font-weight-black text-center">
      {{ $t("text.requestPasswordScreen.title") }}
    </h4>
    <v-form @submit.prevent="resetPassword">
      <v-text-field
        v-model="email"
        label="Email"
        required
        v-bind="emailProps"
        type="email"
      />
      <v-btn
        block
        color="primary"
        type="submit"
        size="large"
        :loading="loading"
      >
        {{ $t("text.requestPasswordScreen.button") }}
      </v-btn>
      <v-btn
        class="mt-3"
        :text="$t('actions.backToLogin')"
        block
        :ripple="false"
        href="/auth/login"
        :disabled="loading"
      />
    </v-form>
  </div>
</template>
<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
import { useApiSupabase } from "~/composables/useApiSupabase";
import { useNotifyStore } from "~/store/notifyStore";

definePageMeta({
  layout: "login-layout",
});
const apiSupabase = useApiSupabase();

const { defineField, handleSubmit } = useForm({
  validationSchema: {
    email: "required|email",
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const vuetifyConfig = (state: any) => ({
  props: {
    "error-messages": state.errors,
  },
});

const [email, emailProps] = defineField("email", vuetifyConfig);
const i18n = useI18n();
const notifyStore = useNotifyStore();
const loading = ref(false);
const resetPassword = handleSubmit(async () => {
  loading.value = true;
  const { error } = await apiSupabase.resetPasswordForEmail(email.value, {
    redirectTo: `${window.location.origin}/auth/resetPassword`,
  });
  loading.value = false;
  if (!error) {
    notifyStore.showNotification(
      i18n.t("text.requestPasswordScreen.success"),
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
