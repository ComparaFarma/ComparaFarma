<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Solicitar nova senha</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="resetPassword">
              <v-text-field
                v-model="email"
                label="Email"
                required
                v-bind="emailProps"
                type="email"
              />
              <v-btn block color="primary" type="submit">
                Reset Password
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" multi-line>
      {{ text }}
      <template #actions>
        <v-btn color="red" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref } from "vue";

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
