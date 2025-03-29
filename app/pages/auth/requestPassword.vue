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
      <v-btn block color="primary" type="submit" size="large"> 
        {{ $t("text.requestPasswordScreen.button") }}
      </v-btn>
      <v-btn
        class="mt-3"
        :text="$t('actions.backToLogin')"
        block
        :ripple="false"
        href="/auth/login"
      />
    </v-form>
    <v-snackbar v-model="snackbar" multi-line>
      {{ text }}
      <template #actions>
        <v-btn color="red" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
definePageMeta({
  layout: "login-layout",
});
const supabase = useSupabaseClient();

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
const snackbar = ref(false);
const text = ref("");

const i18n = useI18n();

const resetPassword = handleSubmit(async () => {
  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${window.location.origin}/auth/resetPassword`,
  });
  if (!error) {
    navigateTo("/auth/login");
    return;
  }
  text.value = i18n.te("supabaseCodes." + error.code)
    ? i18n.t("supabaseCodes." + error.code)
    : error.message;
  snackbar.value = true;
});
</script>
