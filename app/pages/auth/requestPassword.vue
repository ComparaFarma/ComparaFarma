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
                v-model="form.email"
                label="Email"
                required
                :error-messages="v$.email.$errors.map(e => e.$message as string)"
                type="email"
                @blur="v$.email.$touch"
                @input="v$.email.$touch"
              />
              <v-btn
                block
                color="primary"
                :disabled="v$.email.$invalid"
                type="submit"
              >
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
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { ref } from "vue";
import { useSupabase } from "@/utils/supabase";

const supabase = useSupabase();

const form = ref({
  email: "",
});

const v$ = useVuelidate(
  {
    email: { required, email },
  },
  form
);

const snackbar = ref(false);
const text = ref("");

async function resetPassword() {
  const {error} = await supabase.auth.resetPasswordForEmail(form.value.email, {
    redirectTo: `${window.location.origin}/auth/resetPassword`,
  });
    if (error) {
        text.value = 'Verifique o email e tente novamente';
        snackbar.value = true;
        return;
    }
    navigateTo('/auth/login');
}
</script>
