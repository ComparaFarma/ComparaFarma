<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title class="text-h5">Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submit">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                autocomplete="email"
                v-bind="emailProps"
              />
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                autocomplete="current-password"
                v-bind="passwordProps"
              />
              <v-btn color="primary" block type="submit">
                Login
              </v-btn>
            </v-form>
            <v-btn block color="primary" href="/auth/requestPassword">
              Forgot password?
            </v-btn>
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
import { ref } from "vue";
import auth from "~/ middleware/auth";
import { useForm } from "vee-validate";
definePageMeta({
  middleware: auth,
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
    'error-messages': state.errors,
  },
});

const [email, emailProps] = defineField("email", vuetifyConfig);
const [password, passwordProps] = defineField("password", vuetifyConfig);


const submit = handleSubmit(async (values) => {
  console.log(values);

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value.value,
    password: password.value.value,
  });

  if (error) {
    text.value = "Credenciais inválidas";
    snackbar.value = true;
  } else {
    navigateTo("/");
  }
});

const snackbar = ref(false);
const text = ref("");
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
