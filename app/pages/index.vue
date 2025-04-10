<template>
  <div>
    <h1 v-t="'text.mySearch.title'" class="text-subtitle-1 font-weight-bold" />
    <v-row class="my-4">
      <v-col cols="12" md="6">
        <div class="ga-2 d-flex flex-row align-center">
          <span class="px-4">
            <v-icon
              icon="mdi-book"
              size="32"
              color="primary"
              class="mr-2"
              :alt="$t('text.mySearch.search')"
              :title="$t('text.mySearch.search')"
            />
            <span
              v-t="'text.mySearch.createdSearches'"
              class="text-uppercase text-subtitle-1 text-primary"
            />
          </span>
          <v-text-field
            v-model="searchName"
            :label="$t('text.mySearch.searchTextField')"
            :loading="loading"
            :disabled="loading"
            @change="onSearchNameChange"
            density="compact"
            hide-details="auto"
            class="flex-grow-1"
          />
          <v-select
            v-model="selectedSearch"
            :items="searches"
            :label="$t('words.city', { count: 2 })"
            :loading="loading"
            density="compact"
            multiple
            chips
            class="flex-grow-1"
            hide-details="auto"
            @change="onSearchChange"
          />
          <v-btn
            size="small"
            color="primary"
            icon="mdi-magnify"
            :loading="loading"
            @click="onSearchClick"
          />
        </div>

        <v-list>
          <v-list-item-group
            v-for="index in 6"
            :key="index"
            class="my-2"
          >
            <LazyPartialListSearchItem :update-at="new Date('2025-04-10T17:00:00Z')" :description="'Search ' + index" />
          </v-list-item-group>
        </v-list>
          
      </v-col>
      <v-col cols="12" md="6">
        <span class="px-4">
          <v-icon
            icon="mdi-history"
            size="32"
            color="secondary"
            class="mr-2"
            :alt="$t('text.mySearch.lastSearches')"
            :title="$t('text.mySearch.lastSearches')"
          />
          <span
            v-t="'text.mySearch.lastSearches'"
            class="text-uppercase text-subtitle-1 text-secondary"
          />
        </span>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
import { useDashboardStore } from "~/store/dashboardStore";
import auth from "../ middleware/auth";
import { LazyPartialListSearchItem } from "#components";
definePageMeta({
  layout: "dashboard",
  middleware: auth,
});

const dashboardStore = useDashboardStore();
onMounted(() => {
  dashboardStore.setReloadCallback(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  });
});
</script>
