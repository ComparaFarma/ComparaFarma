<template>
  <v-layout ref="app">
    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :temporary="mobile"
      :permanent="!mobile"
      elevation="0"
      class="bg-surface border-e"
    >
      <div class="d-flex align-center pa-4 cursor-pointer" @click="navigateTo('/')">
        <v-img
          src="~/assets/logo.png"
          width="40"
          height="40"
          contain
          class="rounded-lg mr-3"
          :alt="$t('words.brand')"
        />
        <span class="text-h6 font-weight-bold text-primary">
          {{ $t('APPLICATION_NAME') }}
        </span>
      </div>
      <v-divider class="mb-2" />
      <v-list nav class="pa-2">
        <v-list-item
          prepend-icon="mdi-alpha-h-box"
          :title="$t('text.bottomNavigation.mySearches')"
          value="my-searches"
          rounded="lg"
          color="primary"
          @click="navigateTo('/')"
        />
        <v-list-item
          prepend-icon="mdi-plus"
          :title="$t('text.bottomNavigation.createSearch')"
          value="create-search"
          rounded="lg"
          color="primary"
          @click="navigateTo('/search/create')"
        />
      </v-list>
      <template #append>
        <div class="pa-4">
          <v-btn
            block
            variant="text"
            color="error"
            prepend-icon="mdi-logout"
            :loading="logoutLoading"
            @click="logout"
          >
            {{ $t('text.appBar.logout') }}
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar elevation="0" color="surface" class="border-b px-2">
      <v-app-bar-nav-icon v-if="mobile" color="primary" @click="drawer = !drawer" />
      <v-app-bar-title v-if="!mobile" class="text-subtitle-1 text-grey-darken-1">
        Dashboard
      </v-app-bar-title>
      <v-spacer />
      <div v-if="subscriptionUsage" class="usage-meter mr-2 d-flex flex-column">
        <div class="d-flex align-center justify-space-between mb-1 text-caption">
          <div class="d-flex align-center ga-1">
            <v-icon :color="usageColor" size="10">mdi-circle</v-icon>
            <span v-t="'text.appBar.usage'"></span>
          </div>
          <span>{{ subscriptionUsage.usedRequests }} / {{ subscriptionUsage.requestLimit }}</span>
        </div>
        <v-progress-linear
          :model-value="usagePercent"
          :color="usageColor"
          rounded
          height="8"
        />
      </div>

    </v-app-bar>

    <v-main class="bg-background">
      <v-container fluid class="pa-2 pa-md-3">
        <v-pull-to-refresh
          class="px-0"
          :pull-down-threshold="pullDownThreshold"
          @load="load"
        >
          <slot />
        </v-pull-to-refresh>
      </v-container>
    </v-main>

    <v-snackbar-queue v-model="messages" multi-line closable />
    <v-bottom-navigation
      v-if="mobile"
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
        <span class="text-uppercase">{{ $t('text.bottomNavigation.mySearches') }}</span>
      </v-btn>
      <v-btn
        icon
        :value="BottomNavigationType.CREATE_SEARCH"
        size="medium"
        @click="navigateTo('/search/create')"
      >
        <v-icon icon="mdi-plus" />
        <span class="text-uppercase">{{ $t('text.bottomNavigation.createSearch') }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>

<script lang="ts" setup>
import { BottomNavigationType, useDashboardStore } from "~/store/dashboardStore";
import { useNotifyStore } from "~/store/notifyStore";
import { VPullToRefresh } from "vuetify/labs/VPullToRefresh";
import { useApiSupabase } from "~/composables/useApiSupabase";
import { useCityStore } from "~/store/cityStore";
import { useDisplay } from "vuetify";
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";

const { mobile } = useDisplay();
const drawer = ref(!mobile.value);

const notifyStore = useNotifyStore();
const pullDownThreshold = 56;
const { messages } = storeToRefs(notifyStore);

const dashboardStore = useDashboardStore();
const { currentBottomNavigation } = storeToRefs(dashboardStore);
const logoutLoading = ref(false);
const subscriptionUsage = ref<{
  usedRequests: number;
  requestLimit: number;
} | null>(null);
const usagePercent = computed(() => {
  if (!subscriptionUsage.value || subscriptionUsage.value.requestLimit <= 0) {
    return 0;
  }

  return Math.min(
    (subscriptionUsage.value.usedRequests / subscriptionUsage.value.requestLimit) * 100,
    100,
  );
});
const usageColor = computed(() => {
  if (usagePercent.value >= 90) return "error";
  if (usagePercent.value >= 70) return "warning";
  if (usagePercent.value >= 50) return "secondary";
  return "success";
});

const cityStore = useCityStore();
const apiSupabase = useApiSupabase();

async function logout() {
  logoutLoading.value = true;
  await apiSupabase.signOut();
  logoutLoading.value = false;
  navigateTo("/auth/login");
}

async function fetchSubscriptionUsage() {
  try {
    const usage = await $fetch<{
      usedRequests: number;
      requestLimit: number;
    }>("/api/subscription/usage", {
      method: "GET",
    });

    subscriptionUsage.value = usage;
  } catch {
    subscriptionUsage.value = null;
  }
}

const load = async ({ done }: { done: CallableFunction }) => {
  await dashboardStore.reload();
  await fetchSubscriptionUsage();
  done("ok");
};

onMounted(() => {
  if (!apiSupabase.isAuthenticated()) {
    navigateTo("/auth/login");
    return;
  }

  fetchSubscriptionUsage();

  if (cityStore.cities.length == 0) {
    cityStore.fetchCities();
  }
});
</script>

<style scoped>
.usage-meter {
  width: 220px;
}
</style>
