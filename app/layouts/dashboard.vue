<template>
  <v-layout ref="app">
    <v-app-bar elevation="4" color="surface" name="app-bar">
      <v-app-bar-title @click="navigateTo('/')" class="cursor-pointer">
        <div class="d-flex align-center">
          <v-icon size="40" class="mr-2">
            <v-img
              src="~/assets/logo.png"
              width="40"
              height="40"
              contain
              class="rounded-lg"
            />
          </v-icon>

          <span class="text-subtitle-1 font-weight-bold text-primary">
            {{ $t("APPLICATION_NAME") }}
          </span>
        </div>
      </v-app-bar-title>
      <div class="d-flex align-center">
        <!-- Notification icon -->
        <v-btn
          icon
          size="small"
          color="primary"
          class="d-flex align-center justify-center"
          :ripple="false"
          :alt="$t('text.appBar.notification')"
          :title="$t('text.appBar.notification')"
          @click="notifyStore.showNotification('Hello World!')"
        >
          <v-icon icon="mdi-bell" />
        </v-btn>
        <!-- Logout icon   -->
        <v-btn
          icon
          size="small"
          color="primary"
          class="d-flex align-center justify-center"
          :ripple="false"
          :loading="logoutLoading"
          :alt="$t('text.appBar.logout')"
          :title="$t('text.appBar.logout')"
          @click="logout"
        >
          <v-icon icon="mdi-logout" />
        </v-btn>
      </div>
    </v-app-bar>
    <v-main>
      <v-pull-to-refresh
        class="px-4"
        :pull-down-threshold="pullDownThreshold"
        @load="load"
      >
        <slot />
      </v-pull-to-refresh>
    </v-main>
    
    <v-snackbar-queue v-model="messages" multi-line closable />
    <v-bottom-navigation
      :model-value="currentBottomNavigation"
      active
      grow
      mandatory
      class="bottom-0"
      color="secondary"
    >
      <v-btn
        icon
        :value="BottomNavigationType.MY_SEARCHES"
        size="medium"
        @click="navigateTo('/')"
      >
        <v-icon icon="mdi-heart" />
        <span class="text-uppercase">
          {{ $t("text.bottomNavigation.mySearches") }}
        </span>
      </v-btn>
      <v-btn
        icon
        :value="BottomNavigationType.CREATE_SEARCH"
        size="medium"
        @click="navigateTo('/search')"
      >
        <v-icon icon="mdi-plus" />
        <span class="text-uppercase">
          {{ $t("text.bottomNavigation.createSearch") }}
        </span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
<script lang="ts" setup>
import {
  BottomNavigationType,
  useDashboardStore,
} from "~/store/dashboardStore";
import { useNotifyStore } from "~/store/notifyStore";
import { VPullToRefresh } from "vuetify/labs/VPullToRefresh";
import { useApiSupabase } from "~/composables/useApiSupabase";
import { useCityStore } from "~/store/cityStore";


const notifyStore = useNotifyStore();
const pullDownThreshold = 56;
const { messages } = storeToRefs(notifyStore);

const dashboardStore = useDashboardStore();

const { currentBottomNavigation } = storeToRefs(dashboardStore);
const logoutLoading = ref(false);

const cityStore = useCityStore();
cityStore.fetchCities();

const apiSupabase = useApiSupabase();
async function logout() {
  logoutLoading.value = true;
  await apiSupabase.signOut();
  logoutLoading.value = false;

  navigateTo("/auth/login");
}

const load = async ({ done }: { done: CallableFunction }) => {
  // Reload the current page
  await dashboardStore.reload();
  done("ok");
};

onMounted(() => {
  // Check if the user is authenticated
  if (!apiSupabase.isAuthenticated()) {
    navigateTo("/auth/login");
  }
});
</script>
