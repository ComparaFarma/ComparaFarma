<template>
  <v-layout ref="app" class="rounded rounded-md border">
    <v-app-bar elevation="4" color="surface" name="app-bar">
      <v-app-bar-title to="/index" class="cursor-pointer">
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
    <v-snackbar v-model="show" multi-line>
      {{ message }}
      <template #actions>
        <v-btn color="red" variant="text" @click="notifyStore.hideNotification">
          <v-icon icon="mdi-close" />
        </v-btn>
      </template>
    </v-snackbar>
    <v-bottom-navigation
      v-model="currentBottomSheet"
      active
      grow
      class="bottom-0"
      color="secondary"
    >
      <v-btn
        icon
        :value="BottomNavigationType.MY_SEARCHES"
        size="medium"
        to="/"
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
        to="/search"
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
const { message, show } = storeToRefs(notifyStore);

const dashboardStore = useDashboardStore();

const { currentBottomSheet } = storeToRefs(dashboardStore);
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
