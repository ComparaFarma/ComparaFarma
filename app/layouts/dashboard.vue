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
          prepend-icon="mdi-heart"
          :title="$t('text.bottomNavigation.mySearches')"
          value="my-searches"
          @click="navigateTo('/')"
          rounded="lg"
          active-color="primary"
        />
        <v-list-item
          prepend-icon="mdi-plus"
          :title="$t('text.bottomNavigation.createSearch')"
          value="create-search"
          @click="navigateTo('/search/create')"
          rounded="lg"
          active-color="primary"
        />
      </v-list>
      <template v-slot:append>
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
      <v-app-bar-nav-icon v-if="mobile" @click="drawer = !drawer" color="primary" />
      <v-app-bar-title v-if="!mobile" class="text-subtitle-1 text-grey-darken-1">
        Dashboard
      </v-app-bar-title>
      <v-spacer />

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
    <v-bottom-navigation v-if="mobile"
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
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";

const { mobile } = useDisplay();
const drawer = ref(!mobile.value);

const notifyStore = useNotifyStore();
const pullDownThreshold = 56;
const { messages } = storeToRefs(notifyStore);

const dashboardStore = useDashboardStore();
const { currentBottomNavigation } = storeToRefs(dashboardStore);
const logoutLoading = ref(false);

const cityStore = useCityStore();
const apiSupabase = useApiSupabase();

async function logout() {
  logoutLoading.value = true;
  await apiSupabase.signOut();
  logoutLoading.value = false;
  navigateTo("/auth/login");
}

const load = async ({ done }: { done: CallableFunction }) => {
  await dashboardStore.reload();
  done("ok");
};

onMounted(() => {
  if (!apiSupabase.isAuthenticated()) {
    navigateTo("/auth/login");
  }
  if (cityStore.cities.length == 0) {
    cityStore.fetchCities();
  }
});
</script>
