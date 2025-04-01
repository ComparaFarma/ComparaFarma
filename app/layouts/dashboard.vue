<template>
  <v-app class="rounded rounded-md border">
    <v-app-bar elevation="4" color="surface">
      <v-app-bar-title to="/index" class="cursor-pointer">
        <div class="d-flex align-center">
          <v-btn
            icon
            class="d-flex align-center justify-center"
            :ripple="false"
          >
            <v-img
              src="~/assets/logo.png"
              width="40"
              height="40"
              contain
              class="rounded-lg"
            />
          </v-btn>

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
      <slot />
    </v-main>
    <v-footer>
      <v-bottom-navigation
        v-model="currentBottomSheet"
        active
        grow
        color="secondary"
        height="56"
      >
        <v-btn icon :value="BottomNavigationType.MY_SEARCHES" size="medium">
          <v-icon icon="mdi-heart" />
          <span class="text-uppercase">
            {{ $t("text.bottomNavigation.mySearches") }}
          </span>
        </v-btn>
        <v-btn icon :value="BottomNavigationType.CREATE_SEARCH" size="medium">
          <v-icon icon="mdi-plus" />
          <span class="text-uppercase">
            {{ $t("text.bottomNavigation.createSearch") }}
          </span>
        </v-btn>
      </v-bottom-navigation>
    </v-footer>
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
import {
  BottomNavigationType,
  useDashboardStore,
} from "~/store/dashboardStore";
import { useNotifyStore } from "~/store/notifyStore";

const notifyStore = useNotifyStore();

const { message, show } = storeToRefs(notifyStore);

const dashboardStore = useDashboardStore();

const { currentBottomSheet } = storeToRefs(dashboardStore);
const logoutLoading = ref(false);

const supabase = useSupabaseClient();
async function logout() {
  logoutLoading.value = true;
  await supabase.auth.signOut();
  logoutLoading.value = false;

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
