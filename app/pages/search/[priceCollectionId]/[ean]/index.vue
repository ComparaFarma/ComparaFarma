<template>
  <div class="d-flex flex-column my-5 ga-2">
    <div class="d-flex flex-row ga-2 align-center">
      <v-btn size="small" icon color="primary" @click="$router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </div>
    <div class="d-flex flex-row ga-2">
      <h1 class="text-body-1 font-weight-bold">
        {{ titlePage }}
      </h1>
      <v-badge inline color="primary" rounded="0" :content="$t('text.priceHistory.countStore', {count: countStores})" />
    </div>
    <div class="d-flex ga-2" :class="{ 'flex-row': !mobile, 'flex-column': mobile }">
      <span class="text-caption font-weight-bold text-center ma-2">
        {{ t("text.priceHistory.filters.title") }}
      </span>
      <div class="d-flex justify-space-between w-100 align-center" :class="{ 'flex-row': !mobile, 'flex-column': mobile }">
        <div class="d-flex flex-row ga-2" :class="{ 'flex-row': !mobile, 'flex-column w-100': mobile }">
          <!-- Botão que abre o diálogo -->
          <v-menu v-model="dialog" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-btn color="primary" variant="outlined" rounded="xl" v-bind="props">
                <span class="d-flex align-center">
                  {{ $t("text.priceHistory.filters.btnLabelPrice") }}
                  <v-badge v-if="filters.minPrice || filters.maxPrice" color="primary" content="1" inline class="ml-1" />
                </span>
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="text-h6 d-flex justify-space-between align-center">
                <span>{{ $t("text.priceHistory.filters.cardTitle") }}</span>
                <v-btn icon @click="dialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>

              <v-card-text>
                <v-row class="align-center">
                  <v-col cols="5">
                    <v-text-field v-model="filters.minPrice" label="Mínimo" type="number" prefix="R$" step="0.01" min="0" density="compact" />
                  </v-col>

                  <v-col cols="2" class="text-center">
                    <span class="text-h6">{{ $t("text.priceHistory.filters.labelSeparator") }}</span>
                  </v-col>

                  <v-col cols="5">
                    <v-text-field v-model="filters.maxPrice" label="Máximo" type="number" prefix="R$" step="0.01" :min="filters.minPrice" density="compact" />
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn color="red" variant="text" size="small" @click="clearPriceFilter">
                  {{ $t("text.priceHistory.filters.btnLabelClear") }}
                </v-btn>
                <v-btn color="primary" variant="text" size="small" @click="applyPriceFilter">
                  {{ $t("text.priceHistory.filters.btnLabelApply") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>

          <v-autocomplete v-model="storeModel" clearable color="primary" :label="$t('text.priceHistory.filters.selectLabelStore')" item-title="text" item-value="value" rounded :items="storeOptions" variant="outlined" class="text-primary" density="compact" min-width="150" />
        </div>
        <div class="d-flex flex-row ga-2" :class="{ 'w-10': !mobile, 'w-100': mobile }">
          <v-select v-model="sortByModel" item-title="text" item-value="value" :items="sortByOptions" variant="outlined" class="text-primary" density="compact" :dense="mobile" />
        </div>
      </div>
    </div>
    <v-infinite-scroll height="80vh" :items="priceHistoryComputed" @load="load" :key="keyForInfiniteScroll">
      <div class="d-flex flex-wrap align-content-start">
        <template v-for="(item, index) in priceHistoryComputed" :key="index">
          <div class="ma-2 pa-2">
            <LazyPartialListStoreItem :discount="item.discount" :value="item.value" :barcode="item.barcode" :description="item.description" :cnpj="item.cnpj" :address="item.endStreet + ', ' + item.endDistrict" :store-name="item.name" :telephone="item.phone" :unit="item.unit" />
          </div>
        </template>
      </div>
    </v-infinite-scroll>
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