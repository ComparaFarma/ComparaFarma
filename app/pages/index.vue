<template>
  <div class="my-searches-page">
    <v-row>
      <!-- Created Searches Section -->
      <v-col cols="12" :lg="mobile ? 12 : 8">
        <v-card 
          class="searches-card mb-3 overflow-hidden"
          :class="mobile ? 'rounded-lg' : 'rounded-xl'"
          elevation="2"
        >
          <div class="gradient-border primary" />
          
          <!-- Header -->
          <v-card-title class="pa-4">
            <div class="d-flex align-center">
              <div class="icon-wrapper primary mr-3">
                <v-icon icon="mdi-book" size="28" color="white" />
              </div>
              <span 
                v-t="'text.mySearch.createdSearches'" 
                class="text-h6 font-weight-bold text-primary"
              />
            </div>
          </v-card-title>

          <v-divider />

          <!-- Filters -->
          <v-card-text class="pa-3 pa-md-4">
            <v-row class="mb-3">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="filters.name"
                  :label="$t('text.mySearch.searchTextField')"
                  density="comfortable"
                  hide-details="auto"
                  variant="outlined"
                  rounded="lg"
                  prepend-inner-icon="mdi-magnify"
                  @update:model-value="reload"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="filters.cityId"
                  :items="cities"
                  item-title="name"
                  item-value="id"
                  :label="$t('words.city', { count: 2 })"
                  hide-details="auto"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  prepend-inner-icon="mdi-map-marker"
                  @update:model-value="reload"
                />
              </v-col>
            </v-row>

            <!-- Search List -->
            <v-card 
              variant="flat" 
              :rounded="mobile ? 'lg' : 'xl'"
              class="search-list-container"
            >
              <v-infinite-scroll
                :key="keyForInfiniteScroll"
                :height="mobile ? '55vh' : '65vh'"
                :items="mySearches"
                @load="load"
              >
                <template v-for="(item, index) in mySearches" :key="index">
                  <div v-if="item.id" class="search-item pa-2">
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
                      v-if="index < mySearches.length - 1"
                      :key="'divider' + index"
                      class="my-2"
                    />
                  </div>
                </template>
              </v-infinite-scroll>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Last Updates Section (Desktop only) -->
      <v-col v-if="!mobile" cols="12" lg="4">
        <v-card 
          class="updates-card mb-3 overflow-hidden"
          :class="mobile ? 'rounded-lg' : 'rounded-xl'"
          elevation="2"
        >
          <div class="gradient-border secondary" />
          
          <!-- Header -->
          <v-card-title class="pa-4">
            <div class="d-flex align-center">
              <div class="icon-wrapper secondary mr-3">
                <v-icon icon="mdi-history" size="28" color="white" />
              </div>
              <span 
                v-t="'text.mySearch.lastUpdates'" 
                class="text-h6 font-weight-bold text-secondary"
              />
            </div>
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-3 pa-md-4">
            <v-card 
              variant="flat" 
              rounded="xl"
              class="search-list-container"
            >
              <v-infinite-scroll
                :key="keyForInfiniteScroll + '-updates'"
                height="65vh"
                :items="lastUpdateSearches"
                @load="loadLastUpdateSearches"
              >
                <template v-for="(item, index) in lastUpdateSearches" :key="index">
                  <div v-if="item.id" class="search-item pa-2">
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
                      v-if="index < lastUpdateSearches.length - 1"
                      :key="'divider' + index"
                      class="my-2"
                    />
                  </div>
                </template>
              </v-infinite-scroll>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { LazyPartialListSearchItem } from "#components";
import type { PriceCollectionItem } from "~~/server/api/priceCollection";
import { useDashboardStore } from "~/store/dashboardStore";
import type { City } from "~~/server/api/city";
import { useNotifyStore } from "~/store/notifyStore";

const { t } = useI18n();

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
  name: "my-search",
});

useHead({
  title: t("text.mySearch.title"),
});
const {getDate } = useDateUtils();
const { mobile } = useDisplay();


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
    lastUpdateSearches.value = [];
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

function loadLastUpdateSearches({
  done,
}: {
  done: (status: "error" | "loading" | "empty" | "ok") => void;
}) {
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
  }).finally(() => {
    done("error");
    
  });
}
onMounted(() => {
  $fetch("/api/city", {
    method: "GET",
  }).then((res) => {
    cities.value = res;
  });

  if (mobile.value) {
    return;
  }

});
</script>

<style scoped lang="scss">
.my-searches-page {
  width: 100%;
}

.searches-card,
.updates-card {
  position: relative;
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}

.gradient-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  
  &.primary {
    background: linear-gradient(90deg, #0055A5 0%, #003d7a 100%);
  }
  
  &.secondary {
    background: linear-gradient(90deg, #D32F2F 0%, #a52727 100%);
  }
}

.icon-wrapper {
  border-radius: 12px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.primary {
    background: linear-gradient(135deg, #0055A5 0%, #003d7a 100%);
  }
  
  &.secondary {
    background: linear-gradient(135deg, #D32F2F 0%, #a52727 100%);
  }
}

.search-list-container {
  transition: all 0.3s ease;
}

.search-item {
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 85, 165, 0.03);
  }
}
</style>
