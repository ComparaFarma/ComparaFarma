<template>
  <div>
    <v-row class="my-4">
      <v-col cols="12" lg="6">
        <div
          class="ga-2 d-flex"
          :class="{ 'flex-row': !mobile, 'flex-column': mobile }"
        >
          <span class="px-4">
            <v-icon icon="mdi-book" size="32" color="primary" class="mr-2" />
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
          <v-btn size="small" color="primary" :icon="!mobile" :block="mobile">
            <v-icon icon="mdi-magnify" color="white" />
            <span v-t="'words.search'" v-if="mobile" />
          </v-btn>
        </div>
        <v-infinite-scroll
          :key="keyForInfiniteScroll"
          class="my-2 ml-4"
          :height="mobile ? '60vh' : '74vh'"
          :items="mySearches"
          @load="load"
        >
          <template v-for="(item, index) in mySearches" :key="index">
            <div>
              <LazyPartialListSearchItem
                :update-at="
                  item.lastcheckdate ? new Date(item.lastcheckdate) : undefined
                "
                :created-at="new Date(item.createdAt)"
                :title="item.name"
                :cities="item.cities.map((city) => city.city.name)"
                @visualize="() => navigateTo(`/search/${item.id}`)"
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
      <v-col cols="12" md="6" v-if="!mobile" class="align-end">
        <div class="py-2 mb-6">
          <div class="px-4 ga-4">
            <v-icon
              icon="mdi-history"
              size="34"
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
            height="32vh"
            :items="mySearches"
            @load="({ done }) => done('error')"
          >
            <template v-for="(item, index) in newSearches" :key="index">
              <div>
                <LazyPartialListSearchItem
                  :update-at="
                    item.lastcheckdate
                      ? new Date(item.lastcheckdate)
                      : undefined
                  "
                  :created-at="new Date(item.createdAt)"
                  :title="item.name"
                  :cities="item.cities.map((city) => city.city.name)"
                  @visualize="() => navigateTo(`/search/${item.id}`)"
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
            height="34vh"
            :items="mySearches"
            @load="({ done }) => done('error')"
          >
            <template v-for="(item, index) in lastUpdateSearches" :key="index">
              <div>
                <LazyPartialListSearchItem
                  :update-at="
                    item.lastcheckdate
                      ? new Date(item.lastcheckdate)
                      : undefined
                  "
                  :created-at="new Date(item.createdAt)"
                  :title="item.name"
                  :cities="item.cities.map((city) => city.city.name)"
                  @visualize="() => navigateTo(`/search/${item.id}`)"
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
import type { PriceCollectionItem } from "~~/server/api/priceCollection";
import { useDashboardStore } from "~/store/dashboardStore";

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

const mySearches = ref<PriceCollectionItem[]>([]);
const newSearches = ref<PriceCollectionItem[]>([]);
const lastUpdateSearches = ref<PriceCollectionItem[]>([]);

const keyForInfiniteScroll = ref(0);
const timeout = ref<ReturnType<typeof setTimeout> | null>(null);
const dashboard = useDashboardStore();
dashboard.setReloadCallback(async () => {
  // Reload the page
  if (timeout.value) {
    clearTimeout(timeout.value);
  }
  timeout.value = setTimeout(() => {
    mySearches.value = [];
    keyForInfiniteScroll.value++;
  }, 500);
  mySearches.value = [];
  keyForInfiniteScroll.value++;
});

async function load({
  done,
}: {
  done: (status: "error" | "loading" | "empty" | "ok") => void;
}) {
  // Perform API call
  $fetch("/api/priceCollection", {
    method: "GET",
    params: {
      offset: mySearches.value.length,
      limit: 10,
    },
  })
    .then((res) => {
      mySearches.value.push(...res);
      if (res.length === 0) {
        done("empty");
      } else {
        done("ok");
      }
    })
    .catch(() => {
      done("error");
    });
}

const OFFSET = 0;
const LIMIT = 10;
onMounted(() => {
  if (mobile.value) {
    return;
  }
  $fetch("/api/priceCollection", {
    method: "GET",
    params: {
      offset: OFFSET,
      limit: LIMIT,
      orderBy: "createdAt",
    },
  }).then((res) => {
    newSearches.value = res;
  });

  $fetch("/api/priceCollection", {
    method: "GET",
    params: {
      offset: OFFSET,
      limit: LIMIT,
      orderBy: "updatedAt",
    },
  }).then((res) => {
    lastUpdateSearches.value = res;
  });
});
</script>
