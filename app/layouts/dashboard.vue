<template>
  <v-app class="rounded rounded-md border">
    <v-app-bar elevation="4" color="surface" title="Application bar">
      <v-btn text @click="logout">Logout</v-btn>

    </v-app-bar>

    <v-navigation-drawer>
      <v-list nav>
        <v-list-item title="Drawer left" link/>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer location="right">
      <v-list nav>
        <v-list-item title="Drawer right" link/>
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
  </v-app>
</template>
<script lang="ts" setup>
import { useSupabase } from "@/utils/supabase";

const supabase = useSupabase();
async function logout() {
  await supabase.auth.signOut();

  navigateTo("/auth/login");
}
</script>
