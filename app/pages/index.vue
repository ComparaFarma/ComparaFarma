<template>
  <div>
    <h1 v-t="'text.mySearch.title'" class="text-subtitle-1 font-weight-bold" />
    <v-row class="my-4">
      <v-col cols="12" md="6">
        <div
          class="ga-2 d-flex"
          :class="{ 'flex-row': !mobile, 'flex-column': mobile }"
        >
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
            :label="$t('text.mySearch.searchTextField')"
            density="compact"
            hide-details="auto"
          />
          <v-select
            :label="$t('words.city', { count: 2 })"
            density="compact"
            multiple
            chips
            hide-details="auto"
          />
          <v-btn size="small" color="primary" icon="mdi-magnify" />
        </div>
        <v-infinite-scroll
          class="my-2 ml-4"
          height="70vh"
          :items="items"
          @load="load"
        >
          <template v-for="(item, index) in items" :key="item">
            <div>
              <LazyPartialListSearchItem
                :update-at="new Date('2025-04-10T17:00:00Z')"
                :created-at="new Date('2025-04-10T17:00:00Z')"
                :title="'Search ' + index"
              />
              <v-divider
                v-if="index < items.length - 1"
                :key="'divider' + index"
                class="my-2"
              />
            </div>
          </template>
        </v-infinite-scroll>
      </v-col>
      <v-col cols="12" sm="6" v-if="!mobile">
        <div class="py-2 mb-6">
          <div class="px-4 ga-4">
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
          </div>
          <v-infinite-scroll
            class="ml-4"
            height="30vh"
            :items="items"
            @load="load"
          >
            <template v-for="(item, index) in items" :key="item">
              <div>
                <LazyPartialListSearchItem
                  :created-at="new Date('2025-04-10T17:00:00Z')"
                  :update-at="new Date('2025-04-10T17:00:00Z')"
                  :title="'Search ' + index"
                />
                <v-divider
                  v-if="index < items.length - 1"
                  :key="'divider' + index"
                  class="my-2"
                />
              </div>
            </template>
          </v-infinite-scroll>
        </div>
        <div class="py-2">
          <div class="px-4 ga-4">
            <v-icon
              icon="mdi-history"
              size="32"
              color="secondary"
              class="mr-2"
              :alt="$t('text.mySearch.lastUpdates')"
              :title="$t('text.mySearch.lastUpdates')"
            />
            <span
              v-t="'text.mySearch.lastUpdates'"
              class="text-uppercase text-subtitle-1 text-secondary"
            />
          </div>
          <v-infinite-scroll
            class="ml-4"
            height="30vh"
            :items="items"
            @load="load"
          >
            <template v-for="(item, index) in items" :key="item">
              <div>
                <LazyPartialListSearchItem
                  :created-at="new Date('2025-04-10T17:00:00Z')"
                  :update-at="new Date('2025-04-10T17:00:00Z')"
                  :title="'Search ' + index"
                />
                <v-divider
                  v-if="index < items.length - 1"
                  :key="'divider' + index"
                  class="my-2"
                />
              </div>
            </template>
          </v-infinite-scroll>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
import auth from "../ middleware/auth";
import { LazyPartialListSearchItem } from "#components";

const { t } = useI18n();

definePageMeta({
  layout: "dashboard",
  middleware: auth,
  name: "my-search",
});

useHead({
  title: t("text.mySearch.title"),
});

const { mobile } = useDisplay();
const items = ref(Array.from({ length: 30 }, (k, v) => v + 1));

async function api() {
  return new Promise<number[]>((resolve) => {
    setTimeout(() => {
      resolve(
        Array.from({ length: 10 }, (k, v) => v + items.value.at(-1)! + 1)
      );
    }, 1000);
  });
}
async function load({
  done,
}: {
  done: (status: "error" | "loading" | "empty" | "ok") => void;
}) {
  // Perform API call
  const res = await api();

  items.value.push(...res);

  done("ok");
}
</script>
