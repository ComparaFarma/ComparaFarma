<template>
  <div class="price-history-page">
    <!-- Header Section -->
    <v-card 
      class="header-card mb-3 overflow-hidden"
      :class="mobile ? 'rounded-lg' : 'rounded-xl'"
      elevation="2"
    >
      <div class="gradient-border"/>
      
      <v-card-text class="pa-4">
        <div class="d-flex flex-row ga-3 align-center flex-wrap">
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
            {{ titlePage }}
          </h1>
          
          <v-chip
            color="primary"
            variant="elevated"
            size="large"
            class="font-weight-bold"
          >
            {{ $t('text.priceHistory.countStore', {count: countStores}) }}
          </v-chip>
        </div>
      </v-card-text>
    </v-card>

    <!-- Filters Section -->
    <v-card 
      class="filters-card mb-3 overflow-hidden"
      :class="mobile ? 'rounded-lg' : 'rounded-xl'"
      elevation="2"
    >
      <div class="gradient-border primary"/>
      
      <v-card-title class="pa-4">
        <div class="d-flex align-center">
          <div class="icon-wrapper primary mr-3">
            <v-icon icon="mdi-filter-variant" size="24" color="white" />
          </div>
          <span class="text-subtitle-1 font-weight-bold text-primary">
            {{ t("text.priceHistory.filters.title") }}
          </span>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-3 pa-md-4">
        <v-row class="ga-2">
          <v-col cols="12" md="auto">
            <!-- Price Filter Menu -->
            <v-menu v-model="dialog" :close-on-content-click="false">
              <template #activator="{ props }">
                <v-btn 
                  color="primary" 
                  variant="outlined" 
                  rounded="lg"
                  size="large"
                  v-bind="props"
                >
                  <v-icon icon="mdi-currency-usd" class="mr-2" />
                  <span>{{ $t("text.priceHistory.filters.btnLabelPrice") }}</span>
                  <v-badge 
                    v-if="filters.minPrice || filters.maxPrice" 
                    color="error" 
                    content="1" 
                    inline 
                    class="ml-2" 
                  />
                </v-btn>
              </template>

              <v-card 
                min-width="350"
                :class="mobile ? 'rounded-lg' : 'rounded-xl'"
              >
                <v-card-title class="d-flex justify-space-between align-center pa-4">
                  <span class="text-h6 font-weight-bold">
                    {{ $t("text.priceHistory.filters.cardTitle") }}
                  </span>
                  <v-btn icon size="small" @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>

                <v-divider />

                <v-card-text class="pa-4">
                  <v-row class="align-center">
                    <v-col cols="5">
                      <v-text-field 
                        v-model="filters.minPrice" 
                        hide-details="auto" 
                        label="Mínimo" 
                        type="number" 
                        prefix="R$" 
                        step="0.01" 
                        min="0" 
                        density="comfortable"
                        variant="outlined"
                        rounded="lg"
                      />
                    </v-col>

                    <v-col cols="2" class="text-center">
                      <span class="text-subtitle-1 text-grey">
                        {{ $t("text.priceHistory.filters.labelSeparator") }}
                      </span>
                    </v-col>

                    <v-col cols="5">
                      <v-text-field 
                        v-model="filters.maxPrice" 
                        hide-details="auto" 
                        label="Máximo" 
                        type="number" 
                        prefix="R$" 
                        step="0.01" 
                        :min="filters.minPrice" 
                        density="comfortable"
                        variant="outlined"
                        rounded="lg"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-divider />

                <v-card-actions class="pa-3">
                  <v-spacer />
                  <v-btn 
                    color="error" 
                    variant="text" 
                    @click="clearPriceFilter"
                  >
                    {{ $t("text.priceHistory.filters.btnLabelClear") }}
                  </v-btn>
                  <v-btn 
                    color="primary" 
                    variant="elevated"
                    @click="applyPriceFilter"
                  >
                    {{ $t("text.priceHistory.filters.btnLabelApply") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>

          <v-col cols="12" md="">
            <v-autocomplete 
              v-model="storeModel" 
              hide-details="auto" 
              clearable 
              color="primary" 
              :label="$t('text.priceHistory.filters.selectLabelStore')" 
              item-title="text" 
              item-value="value" 
              rounded="lg"
              :items="storeOptions" 
              variant="outlined" 
              density="comfortable"
              prepend-inner-icon="mdi-store"
            />
          </v-col>

          <v-col cols="12" md="auto">
            <v-select 
              v-model="sortByModel" 
              hide-details="auto" 
              item-title="text" 
              item-value="value" 
              :items="sortByOptions" 
              variant="outlined" 
              density="comfortable"
              rounded="lg"
              prepend-inner-icon="mdi-sort"
              min-width="200"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Results Section -->
    <v-card 
      class="results-card overflow-hidden"
      :class="mobile ? 'rounded-lg' : 'rounded-xl'"
      elevation="2"
    >
      <v-card-text class="pa-2">
        <v-infinite-scroll 
          :key="keyForInfiniteScroll" 
          height="65vh" 
          :items="priceHistoryComputed" 
          @load="load"
        >
          <div class="d-flex flex-wrap ga-2 pa-2">
            <template v-for="(item, index) in priceHistoryComputed" :key="index">
              <div class="store-card-wrapper">
                <LazyPartialListStoreItem 
                  :discount="item.discount" 
                  :value="item.value" 
                  :barcode="item.barcode" 
                  :description="item.description" 
                  :cnpj="item.cnpj" 
                  :address="item.endStreet + ', ' + item.endDistrict" 
                  :store-name="item.name" 
                  :telephone="item.phone" 
                  :unit="item.unit"
                />
              </div>
            </template>
          </div>
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
import type { GetPriceCollectionPriceHistory } from "~~/server/api/priceCollectionProduct/show";
import { LazyPartialListStoreItem } from "#components";
import { useNotifyStore } from "~/store/notifyStore";


function validateIdParam(route: RouteLocationNormalized) {
  return (route.params.ean &&
    !isNaN(Number(route.params.ean))) as boolean;
}

definePageMeta({
  layout: "dashboard",
  validate: validateIdParam,
});

const dashboard = useDashboardStore();
const route = useRoute();
const { t } = useI18n();
const { mobile } = useDisplay();
const keyForInfiniteScroll = ref(0);
const dialog = ref(false);
const titlePage = ref("");
const notify = useNotifyStore();



const timeout = ref<ReturnType<typeof setTimeout> | null>(null);

async function reloadSearch() {
  if (timeout.value) {
    clearTimeout(timeout.value);
  }
  timeout.value = setTimeout(() => {
    priceHistory.value = [];
    keyForInfiniteScroll.value++;
  }, 500);
}

const sortByOptions = [
  { text: t("text.priceHistory.sortBy.minPrice"), value: "minPrice" },
  { text: t("text.priceHistory.sortBy.maxPrice"), value: "maxPrice" },
];

const sortByModel = ref("minPrice");
const storeModel = ref(null)

const storeOptions = computed(() => {
  return priceHistory.value.map((item) => ({
    text: item.name + " - " + item.cnpj?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"),
    value: item.cnpj,
  }));
});

watch(() => sortByModel.value, (newValue) => {
  reloadSearch()
  if (newValue == 'minPrice') {
    filters.value.sortBy = 'value';
    filters.value.descending = true;
  } else if (newValue == 'maxPrice') {
    filters.value.sortBy = 'value';
    filters.value.descending = false;
  }

  load({
    done: (status) => {
      if (status === "error") {
        notify.showNotification(t("text.priceHistory.notify.error"), "error");
      }
    },
  });
});

watch(() => storeModel.value, (newValue) => {
  reloadSearch()
  filters.value.storeCnpj = newValue;
  load({
    done: (status) => {
      if (status === "error") {
        notify.showNotification(t("text.priceHistory.notify.error"), "error");
      }
    },
  });
});

const priceHistory = ref<GetPriceCollectionPriceHistory[]>([])

const maxValueHistory = computed(() => {
  return priceHistory.value.reduce((acc, item) => {
    return Math.max(acc, item.value);
  }, 0);
});

const minValueHistory = computed(() => {
  return priceHistory.value.reduce((acc, item) => {
    return Math.min(acc, item.value);
  }, maxValueHistory.value);
});

const countStores = computed(() => {
  return priceHistory.value.length;
});

const priceHistoryComputed = computed(() => {
  console.log(minValueHistory.value);
  return priceHistory.value.map((item) => {
    return {
      ...item,
      discount: (maxValueHistory.value - item.value)/maxValueHistory.value,
      cnpj: item.cnpj?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"),
      phone: item.phone?.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3"),
      endDistrict: item.endDistrict?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"),
      endStreet: item.endStreet?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    };
  });
});

const filters = ref<{
  cityId: number | null;
  productEanOrDescription: string | null;
  storeCnpj: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: string;
  descending: boolean;
}>({
  cityId: null,
  productEanOrDescription: null,
  storeCnpj: null,
  minPrice: null,
  maxPrice: null,
  sortBy: 'value',
  descending: true,
});

onMounted(() => {
  dashboard.openBottomNavigation(BottomNavigationType.MY_SEARCHES);
  dashboard.setReloadCallback(reloadSearch);
});

function applyPriceFilter() {
  priceHistory.value = []; // Limpa o histórico de preços antes de aplicar o filtro

  load({
    done: (status) => {
      if (status === "error") {
        notify.showNotification(t("text.priceHistory.notify.error"), "error");
      }
    },
  });

  dialog.value = false;
}

function clearPriceFilter() {
  filters.value.minPrice = null;
  filters.value.maxPrice = null;

  priceHistory.value = []; // Limpa o histórico de preços antes de aplicar o filtro

  load({
    done: (status) => {
      if (status === "error") {
        notify.showNotification(t("text.priceHistory.notify.error"), "error");
      }
    },
  });
  dialog.value = false;
}

async function load({
  done,
}: {
  done: (status: "error" | "loading" | "empty" | "ok") => void;
}) {
  // Perform API call
  $fetch("/api/priceCollectionProduct/show", {
    method: "GET",
    params: {
      offset: priceHistory.value?.length ?? 0,
      limit: 1000,
      priceCollectionId: route.params.priceCollectionId,
      cityId: filters.value.cityId ?? undefined,
      productEanOrDescription: route.params.ean,
      storeCnpj: filters.value.storeCnpj ?? undefined,
      minPrice: filters.value?.minPrice && filters.value?.minPrice >= 0 ? filters.value.minPrice : undefined,
      maxPrice: filters.value.maxPrice && filters.value.maxPrice >= 0 ? filters.value.maxPrice : undefined,
      sortBy: filters.value.sortBy ?? undefined,
      descending: filters.value.descending ?? undefined,
    },
  })
    .then((res) => {
      if (res.length === 0) {
        done("empty");
      } else {
        priceHistory.value.push(...res);

        if (titlePage.value === "") {
          titlePage.value = priceHistory.value[0]?.description ?? "";
        }
        done("ok");
      }
    })
    .catch(() => {
      done("error");
    });
}

</script>

<style scoped lang="scss">
.price-history-page {
  width: 100%;
}

.header-card,
.filters-card,
.results-card {
  position: relative;
  transition: all 0.3s ease;
}

.filters-card:hover {
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
}

.store-card-wrapper {
  flex: 1 1 300px;
  min-width: 280px;
  max-width: 400px;
  
  @media (max-width: 600px) {
    flex: 1 1 100%;
    max-width: 100%;
  }
}
</style>