<template>
  <div class="price-collection-page">
    <!-- Header Section -->
    <v-card 
      class="header-card mb-3 overflow-hidden"
      :class="mobile ? 'rounded-lg' : 'rounded-xl'"
      elevation="2"
    >
      <div class="gradient-border"/>
      
      <v-card-text class="pa-4">
        <div class="d-flex flex-row ga-3 align-center">
          <v-btn 
            size="small" 
            icon 
            variant="outlined"
            color="primary"
            @click="$router.back()"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          
          <h1 class="text-h6 text-md-h5 font-weight-bold">
            {{ priceCollection?.name }}
          </h1>
          
          <v-chip
            color="primary"
            variant="elevated"
            size="large"
            class="font-weight-bold"
          >
            {{
              $t('text.priceCollectionId.countProduct', {
                count: priceCollection?.countproduct,
              })
            }}
          </v-chip>
        </div>
      </v-card-text>
    </v-card>

    <!-- Filters Section -->
    <v-row class="mb-3">
      <v-col cols="12" md="4">
        <v-card 
          class="filter-card overflow-hidden"
          :class="mobile ? 'rounded-lg' : 'rounded-xl'" 
          elevation="2"
        >
          <div class="gradient-border primary"/>
          
          <v-card-title class="pa-4">
            <div class="d-flex align-center">
              <div class="icon-wrapper primary mr-3">
                <v-icon icon="mdi-cube-outline" size="24" color="white" />
              </div>
              <span v-t="'words.product'" class="text-subtitle-1 font-weight-bold text-primary" />
            </div>
          </v-card-title>
          
          <v-card-text class="pa-3">
            <v-text-field
              v-model="filters.productEanOrDescription"
              clearable
              variant="outlined"
              :label="$t('text.priceCollectionId.searchEanOrDescription')"
              prepend-inner-icon="mdi-magnify"
              density="comfortable"
              rounded="lg"
              hide-details
              @update:model-value="reloadSearch"
            />
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card 
          class="filter-card overflow-hidden"
          :class="mobile ? 'rounded-lg' : 'rounded-xl'"
          elevation="2"
        >
          <div class="gradient-border secondary"/>
          
          <v-card-title class="pa-4">
            <div class="d-flex align-center">
              <div class="icon-wrapper secondary mr-3">
                <v-icon icon="mdi-store" size="24" color="white" />
              </div>
              <span v-t="'words.concurrent'" class="text-subtitle-1 font-weight-bold text-secondary" />
            </div>
          </v-card-title>
          
          <v-card-text class="pa-3">
            <v-autocomplete
              v-model="filters.storeCnpj"
              :items="stores"
              item-value="cnpj"
              variant="outlined"
              :label="$t('words.concurrent')"
              prepend-inner-icon="mdi-magnify"
              clearable
              item-title="name"
              density="comfortable"
              rounded="lg"
              hide-details
              @update:model-value="reloadSearch"
            >
              <template #item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :subtitle="item.raw.cnpj"
                  :title="item.raw.name"
                />
              </template>
              <template #selection="{ item }">
                <v-list-item :title="`${item.raw.name} (${item.raw.cnpj})`" />
              </template>
            </v-autocomplete>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card 
          class="filter-card overflow-hidden"
          :class="mobile ? 'rounded-lg' : 'rounded-xl'"
          elevation="2"
        >
          <div class="gradient-border success"/>
          
          <v-card-title class="pa-4">
            <div class="d-flex align-center">
              <div class="icon-wrapper success mr-3">
                <v-icon icon="mdi-map-marker" size="24" color="white" />
              </div>
              <span v-t="'words.city'" class="text-subtitle-1 font-weight-bold text-success" />
            </div>
          </v-card-title>
          
          <v-card-text class="pa-3">
            <v-autocomplete
              v-model="filters.cityId"
              :items="cities"
              item-title="name"
              item-value="id"
              variant="outlined"
              :label="$t('words.city')"
              prepend-inner-icon="mdi-magnify"
              clearable
              density="comfortable"
              rounded="lg"
              hide-details
              @update:model-value="reloadSearch"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Products List -->
    <v-card 
      class="products-card overflow-hidden"
      :class="mobile ? 'rounded-lg' : 'rounded-xl'"
      elevation="2"
    >
      <v-card-text class="pa-2">
        <v-infinite-scroll
          :key="keyForInfiniteScroll"
          height="65vh"
          :items="priceCollectionProducts"
          @load="load"
        >
          <v-expansion-panels variant="accordion" class="product-list">
            <v-expansion-panel
              v-for="(item, index) in priceCollectionProducts"
              :key="index"
              class="product-item mb-2"
              :class="mobile ? 'rounded-lg' : 'rounded-xl'"
              elevation="0"
            >
              <v-expansion-panel-title>
                <v-row align="center" justify="space-between">
                  <v-col cols="12" md="4" class="d-flex flex-column">
                    <span class="text-body-1 font-weight-medium">
                      {{ item.description ?? $t("words.undefined") }}
                    </span>
                    <span class="d-flex flex-row ga-1 align-center mt-1">
                      <v-icon icon="mdi-barcode" size="18" color="grey" />
                      <span class="text-caption text-grey-darken-1">
                        {{ item.barcode }}
                      </span>
                    </span>
                  </v-col>
                  
                  <v-col cols="12" md="8">
                    <v-row justify="end" align="center" class="ga-4">
                      <v-col cols="auto">
                        <div class="d-flex align-center ga-2">
                          <v-icon icon="mdi-trending-down" color="success" size="20" />
                          <div class="d-flex flex-column">
                            <span class="text-caption text-grey">Menor</span>
                            <span class="text-subtitle-1 font-weight-bold text-success">
                              {{ $n(item.minvalue ?? 0, "currency") }}
                            </span>
                          </div>
                        </div>
                      </v-col>
                      
                      <v-col cols="auto">
                        <div class="d-flex align-center ga-2">
                          <v-icon icon="mdi-trending-up" color="error" size="20" />
                          <div class="d-flex flex-column">
                            <span class="text-caption text-grey">Maior</span>
                            <span class="text-subtitle-1 font-weight-bold text-error">
                              {{ $n(item.maxvalue ?? 0, "currency") }}
                            </span>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-expansion-panel-title>
              
              <v-expansion-panel-text>
                <v-row align="center" justify="space-between" class="pa-2">
                  <v-col cols="12" md="3">
                    <v-img
                      :src="item.image ?? undefined"
                      :alt="item.description ?? undefined"
                      max-height="170px"
                      class="rounded-lg"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="5">
                    <v-row justify="center" align="center" class="mb-4">
                      <v-col cols="6">
                        <div class="price-box success pa-3 rounded-lg">
                          <span class="text-caption text-grey-darken-2 d-block mb-1">
                            {{ $t('text.priceCollectionId.minPrice') }}
                          </span>
                          <div class="text-h5 font-weight-bold text-success">
                            {{ $n(item.minvalue ?? 0, "currency") }}
                          </div>
                          <div class="text-caption text-grey-darken-1">
                            {{ item.minvaluestorename }}
                          </div>
                        </div>
                      </v-col>
                      
                      <v-col cols="6">
                        <div class="price-box error pa-3 rounded-lg">
                          <span class="text-caption text-grey-darken-2 d-block mb-1">
                            {{ $t('text.priceCollectionId.maxPrice') }}
                          </span>
                          <div class="text-h5 font-weight-bold text-error">
                            {{ $n(item.maxvalue ?? 0, "currency") }}
                          </div>
                          <div class="text-caption text-grey-darken-1">
                            {{ item.maxvaluestorename }}
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                    
                    <v-row align="center" class="ga-2 mb-2">
                      <v-icon icon="mdi-barcode" size="32" color="grey" />
                      <span class="text-body-2 text-grey-darken-1">
                        {{ $t('words.barcode') }}:
                      </span>
                      <span class="text-body-2 font-weight-bold">
                        {{ item.barcode }}
                      </span>
                    </v-row>
                    
                    <v-row class="mb-2">
                      <span class="text-caption text-grey-darken-1">
                        {{
                          $t("text.priceCollectionId.updatedAt", {
                            time: item.lastupdateat
                              ? getDateFromNowFormated(getDate(item.lastupdateat))
                              : $t("words.undefined"),
                          })
                        }}
                      </span>
                    </v-row>
                  </v-col>
                  
                  <v-col cols="12" md="3">
                    <v-btn 
                      color="primary" 
                      size="large" 
                      :block="mobile"
                      variant="elevated"
                      class="font-weight-bold"
                      rounded="lg"
                      @click="navigateTo(`/search/${item.pricecollectionid}/${item.barcode}`)"
                    >
                      <v-icon icon="mdi-chart-line" class="mr-2" />
                      <span class="text-none">
                        {{
                          $t("text.priceCollectionId.compareStore", {
                            count: item.countstore,
                          })
                        }}
                      </span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-infinite-scroll>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import {
  BottomNavigationType,
  useDashboardStore,
} from "~/store/dashboardStore";
import type { RouteLocationNormalized } from "vue-router";
import type { PriceCollectionItem } from "~~/server/api/priceCollection";
import type { GetPriceCollectionProducts } from "~~/server/api/priceCollectionProduct";
import type { Store } from "~~/server/api/store";

function validateIdParam(route: RouteLocationNormalized) {
  return (route.params.priceCollectionId &&
    !isNaN(Number(route.params.priceCollectionId))) as boolean;
}
const { getDateFromNowFormated } = useDateUtils();
definePageMeta({
  layout: "dashboard",
  validate: validateIdParam,
});
const { getDate } = useDateUtils();
const { mobile } = useDisplay();
const dashboard = useDashboardStore();
const keyForInfiniteScroll = ref(0);
dashboard.openBottomNavigation(BottomNavigationType.MY_SEARCHES);
const route = useRoute();

const priceCollection = ref<PriceCollectionItem | null>(null);
const priceCollectionProducts = ref<GetPriceCollectionProducts[]>([]);
const stores = ref<Store[]>([]);
const filters = ref<{
  cityId: number | null;
  productEanOrDescription: string | null;
  storeCnpj: number | null;
}>({
  cityId: null,
  productEanOrDescription: null,
  storeCnpj: null,
});

const timeout = ref<ReturnType<typeof setTimeout> | null>(null);
async function reloadSearch() {
  if (timeout.value) {
    clearTimeout(timeout.value);
  }
  timeout.value = setTimeout(() => {
    priceCollectionProducts.value = [];
    keyForInfiniteScroll.value++;
  }, 500);
}

onMounted(() => {
  dashboard.setReloadCallback(reloadSearch);
  $fetch("/api/priceCollection/show", {
    method: "GET",
    params: {
      id: route.params.priceCollectionId,
    },
  }).then((res) => {
    priceCollection.value = res;
  });

  $fetch("/api/store", {
    method: "GET",
    params: {
      priceCollectionId: route.params.priceCollectionId,
    },
  }).then((res) => {
    stores.value = res;
  });
});

const cities = computed(() => {
  return priceCollection.value?.cities.map((city) => {
    return {
      id: city.city.id,
      name: city.city.name,
    };
  });
});

async function load({
  done,
}: {
  done: (status: "error" | "loading" | "empty" | "ok") => void;
}) {
  // Perform API call
  $fetch("/api/priceCollectionProduct", {
    method: "GET",
    params: {
      offset: priceCollectionProducts.value.length,
      limit: 10,
      priceCollectionId: route.params.priceCollectionId,
      cityId: filters.value.cityId ?? undefined,
      productEanOrDescription:
        filters.value.productEanOrDescription ?? undefined,
      storeCnpj: filters.value.storeCnpj ?? undefined,
    },
  })
    .then((res) => {
      if (res.length === 0) {
        done("empty");
      } else {
        priceCollectionProducts.value.push(...res);
        done("ok");
      }
    })
    .catch(() => {
      done("error");
    });
}
</script>

<style scoped lang="scss">
.price-collection-page {
  width: 100%;
}

.header-card,
.filter-card,
.products-card {
  position: relative;
  transition: all 0.3s ease;
}

.filter-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.gradient-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0055A5 0%, #003d7a 100%);
  
  &.primary {
    background: linear-gradient(90deg, #0055A5 0%, #003d7a 100%);
  }
  
  &.secondary {
    background: linear-gradient(90deg, #D32F2F 0%, #a52727 100%);
  }
  
  &.success {
    background: linear-gradient(90deg, #388E3C 0%, #2d7a30 100%);
  }
}

.icon-wrapper {
  border-radius: 10px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.primary {
    background: linear-gradient(135deg, #0055A5 0%, #003d7a 100%);
  }
  
  &.secondary {
    background: linear-gradient(135deg, #D32F2F 0%, #a52727 100%);
  }
  
  &.success {
    background: linear-gradient(135deg, #388E3C 0%, #2d7a30 100%);
  }
}

.product-list {
  .product-item {
    border: 1px solid rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    
    &:hover {
      border-color: rgba(0, 85, 165, 0.3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
  }
}

.price-box {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.08);
  
  &.success {
    background: rgba(56, 142, 60, 0.05);
    border-color: rgba(56, 142, 60, 0.2);
  }
  
  &.error {
    background: rgba(211, 47, 47, 0.05);
    border-color: rgba(211, 47, 47, 0.2);
  }
}
</style>
