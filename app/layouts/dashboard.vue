<template>
  <v-app class="rounded rounded-md border">
    <v-app-bar elevation="4" color="surface" title="Application bar">
      <v-btn text @click="logout">Logout</v-btn>
    </v-app-bar>

    <v-navigation-drawer>
      <v-list nav>
        <v-list-item title="Drawer left" link />
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer location="right">
      <v-list nav>
        <v-list-item title="Drawer right" link />
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center" height="300">
      <v-container>
        <v-sheet
          border="dashed md"
          color="surface-light"
          height="200"
          rounded="lg"
          width="100%"
        />
      </v-container>
    </v-main>
    <v-snackbar v-model="show" multi-line>
      {{ message }}
      <template #actions>
        <v-btn color="red" variant="text" @click="notifyStore.hideNotification">
          <v-icon icon="mdi-close" />
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
<script lang="ts" setup>
import { useNotifyStore } from "~/store/notifyStore";

const notifyStore = useNotifyStore();

const { message, show } = storeToRefs(notifyStore);

const supabase = useSupabaseClient();
async function logout() {
  await supabase.auth.signOut();

  navigateTo("/auth/login");
}

onMounted(() => {
  const { value } = useSupabaseUser();
  console.log(value?.user_metadata);

  const session = useSupabaseSession();
  if (!session.value) {
    navigateTo("/auth/login");
  }
});
</script>
