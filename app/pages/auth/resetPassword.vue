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
                    v-model="password"
                    label="Password"
                    type="password"
                    autocomplete="new-password"
                    v-bind="passwordProps"
                  />
                  <v-text-field
                    key="passwordConfirmation"
                    v-model="passwordConfirmation"
                    v-bind="passwordConfirmationProps"
                    label="Confirm Password"
                    type="password"
                    autocomplete="new-password"
                  />
                  <v-btn color="primary" type="submit"> Reset Password </v-btn>
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
    'error-messages': state.errors,
  },
});

const { defineField, handleSubmit } = useForm({
  validationSchema: {
    password: "required|email",
    passwordConfirmation: "required|email|confirmed:password",
  },
});

const [password, passwordProps] = defineField("password", vuetifyConfig);
const [passwordConfirmation, passwordConfirmationProps] = defineField(
  "passwordConfirmation",
  vuetifyConfig
);

const resetPassword = handleSubmit(async () => {
  const { error } = await supabase.auth.updateUser({
    password: password.value,
  });
  if (error) {
    console.error(error);
  } else {
    navigateTo("/auth/login");
  }
});
</script>
