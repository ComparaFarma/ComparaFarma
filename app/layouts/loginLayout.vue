<template>
  <v-app>
    <v-container class="fill-height" fluid>
      <v-row justify="center" align="center">
        <v-col :cols="0" md="6" align="center">
          <v-img
            src="~/assets/logo.svg"
            max-width="500"
            max-height="500"
            contain
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-col cols="12" md="10" class="d-flex flex-column ga-3">
            <v-main>
              <slot />
            </v-main>
          </v-col>
        </v-col>
      </v-row>
      <v-snackbar-queue v-model="messages" multi-line closable />
    </v-container>
  </v-app>
</template>
<script setup lang="ts">
import { useNotifyStore } from "~/store/notifyStore";

const notifyStore = useNotifyStore();

const { messages } = storeToRefs(notifyStore);
</script>
