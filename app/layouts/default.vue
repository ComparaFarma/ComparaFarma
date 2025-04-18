<template>
  <v-app>
    <v-main>
      <slot />
    </v-main>

    <AppFooter />
    <v-snackbar-queue v-model="messages" multi-line closable />
  </v-app>
</template>
<script setup lang="ts">
import { useNotifyStore } from "~/store/notifyStore";

const notifyStore = useNotifyStore();

const { messages } = storeToRefs(notifyStore);
</script>
