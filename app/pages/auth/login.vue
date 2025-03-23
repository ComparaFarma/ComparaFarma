<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title class="text-h5">Login</v-card-title>
          <v-card-text>
            <v-form ref="loginForm" v-model="valid">
              <v-text-field
                v-model="form.email"
                :error-messages="v$.email.$errors.map(e => e.$message as string)"
                label="Email"
                type="email"
                @blur="v$.email.$touch"
                @input="v$.email.$touch"
              />
              <v-text-field
                v-model="form.password"
                :error-messages="v$.password.$errors.map(e => e.$message as string)"
                label="Password"
                type="password"
                @blur="v$.password.$touch"
                @input="v$.password.$touch"
              />
              <v-btn :disabled="!valid" color="primary" block @click="login">
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" multi-line>
      {{ text }}

      <template v-slot:actions>
        <v-btn color="red" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { useSupabase } from "@/utils/supabase";
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { ref } from "vue";
import auth from '~/ middleware/auth';
definePageMeta({
    middleware: auth,
});

const supabase = useSupabase();

const form = reactive({
  email: "",
  password: "",
});

const rules = {
  email: { required, email },
  password: { required },
};

const v$ = useVuelidate(rules, form);

const valid = ref(false);

const login = async () => {
    const { value } = v$;
    if (value.$invalid) {
      return;
    }
  const { error } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password,
  });

  if (error) {
    text.value = "Credenciais inválidas";
    snackbar.value = true;
  }
};

const snackbar = ref(false);
const text = ref("");
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
