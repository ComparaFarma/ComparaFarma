<template>
  <v-app>
    <v-main>
      <slot />
    </v-main>

    <AppFooter />
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
<script setup lang="ts">
import { useNotifyStore } from "~/store/notifyStore";

const notifyStore = useNotifyStore();

const { message, show } = storeToRefs(notifyStore);
</script>
