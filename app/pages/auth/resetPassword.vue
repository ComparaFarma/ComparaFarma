<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="6" offset-md="3">
            <v-card>
              <v-card-title>
                <span class="headline">Reset Password</span>
              </v-card-title>
              <v-card-text>
                <v-form @submit.prevent="resetPassword">
                  <v-text-field
                    key="password"
                    v-model="form.password"
                    :error-messages="v$.password.$errors.map(e => e.$message as string)"
                    label="Password"
                    type="password"
                    @blur="v$.password.$touch"
                    @input="v$.password.$touch"
                  />
                  <v-text-field
                    key="passwordConfirmation"
                    v-model="form.passwordConfirmation"
                    :error-messages="v$.passwordConfirmation.$errors.map(e => e.$message as string)"
                    label="Confirm Password"
                    type="password"
                    @blur="v$.passwordConfirmation.$touch"
                    @input="v$.passwordConfirmation.$touch"
                  />
                  <v-btn color="primary" :disabled="v$.$invalid" type="submit">
                    Reset Password
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, sameAs } from "@vuelidate/validators";

const route = useRoute();
onBeforeMount(() => {
  // check the query params
  if (route.fullPath.includes("access_denied")) {
    navigateTo("/auth/login");
  }
});

const supabase = useSupabaseClient();

const form = reactive({
  password: "",
  passwordConfirmation: "",
});

const v$ = useVuelidate(
  {
    password: { required },
    passwordConfirmation: {
      required,
      sameAs: sameAs(computed(() => form.password)),
    },
  },
  form
);

async function resetPassword() {
  v$.value.$touch();
  if (!v$.value.$invalid) {
    const { error } = await supabase.auth.updateUser({
      password: form.password,
    });
    if (error) {
      console.error(error);
    } else {
      navigateTo("/auth/login");
    }
  }
}
</script>
