<template>
  <div>
    <v-row class="my-4">
      <v-col cols="12" lg="8">
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
            v-model="filters.name"
            :label="$t('text.mySearch.searchTextField')"
            density="compact"
            hide-details="auto"
            @update:model-value="reload"
          />
          <v-autocomplete
            v-model="filters.cityId"
            :items="cities"
            item-title="name"
            item-value="id"
            :label="$t('words.city', { count: 2 })"
            hide-details="auto"
            variant="outlined"
            density="compact"
            @update:model-value="reload"
          />
          <v-btn size="small" color="primary" :icon="!mobile" :block="mobile">
            <v-icon icon="mdi-magnify" color="white" />
            <span v-if="mobile" v-t="'words.search'" />
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
            <div v-if="item.id">
              <LazyPartialListSearchItem
                :update-at="
                  item.lastcheckdate ? getDate(item.lastcheckdate) : undefined
                "
                :created-at="getDate(item.createdAt)"
                :title="item.name"
                :cities="item.cities.map((city) => city.city.name)"
                :loading="loading"
                @visualize="() => navigateTo(`/search/${item.id}`)"
                @delete="onDelete(item.id)"
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
      <v-col v-if="!mobile" cols="12" md="4" class="align-end">
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
            height="74vh"
            :items="mySearches"
            @load="({ done }) => done('error')"
          >
            <template v-for="(item, index) in lastUpdateSearches" :key="index">
              <div v-if="item.id">
                <LazyPartialListSearchItem
                  :update-at="
                    item.lastcheckdate
                      ? getDate(item.lastcheckdate)
                      : undefined
                  "
                  :created-at="getDate(item.createdAt)"
                  :title="item.name"
                  :cities="item.cities.map((city) => city.city.name)"
                  :loading="loading"
                  @visualize="() => navigateTo(`/search/${item.id}`)"
                  @delete="onDelete(item.id)"
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
import type { City } from "~~/server/api/city";
import { useNotifyStore } from "~/store/notifyStore";

const { t } = useI18n();

definePageMeta({
  layout: "dashboard",
  middleware: auth,
  name: "my-search",
});

useHead({
  title: t("text.mySearch.title"),
});
const {getDate } = useDateUtils();
const { mobile } = useDisplay();
const items = ref(Array.from({ length: 30 }, (k, v) => v + 1));

const mySearches = ref<PriceCollectionItem[]>([]);
const lastUpdateSearches = ref<PriceCollectionItem[]>([]);

const cities = ref<City[]>([]);

const filters = ref<{
  name: string;
  cityId: number | null;
}>({
  name: "",
  cityId: null,
});

const keyForInfiniteScroll = ref(0);
const timeout = ref<ReturnType<typeof setTimeout> | null>(null);
const dashboard = useDashboardStore();

async function reload() {
  // Reload the page
  if (timeout.value) {
    clearTimeout(timeout.value);
  }
  timeout.value = setTimeout(() => {
    mySearches.value = [];
    keyForInfiniteScroll.value++;
  }, 500);
}

dashboard.setReloadCallback(reload);

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
      cityId: filters.value.cityId,
      name: filters.value.name,
      orderBy: "createdAt",
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

const notify = useNotifyStore();
const loading = ref(false);

function onDelete(id: number) {
  if (loading.value) {
    return;
  }
  loading.value = true;
  $fetch(`/api/priceCollection/delete`, {
    method: "DELETE",
    body: {
      id,
    },
  })
    .then(() => {
      mySearches.value = mySearches.value.filter((item) => item.id != id);
      lastUpdateSearches.value = lastUpdateSearches.value.filter(
        (item) => item.id != id
      );
      notify.showNotification(t("text.mySearch.deleteSuccess"), "success");
    })
    .catch(() => {
      notify.showNotification(t("text.mySearch.deleteError"), "error");
    }).finally(() => {
      loading.value = false;
    });
}

const OFFSET = 0;
const LIMIT = 4;
onMounted(() => {
  $fetch("/api/city", {
    method: "GET",
  }).then((res) => {
    cities.value = res;
  });

  if (mobile.value) {
    return;
  }

  $fetch("/api/priceCollection", {
    method: "GET",
    params: {
      offset: OFFSET,
      limit: LIMIT,
      orderBy: "lastcheckdate",
      hasLastcheckdate: true,
    },
  }).then((res) => {
    lastUpdateSearches.value = res;
  });
});
</script>
