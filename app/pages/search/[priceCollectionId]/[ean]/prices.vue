<template>
  <div class="d-flex flex-column my-5 ga-5">
    <div class="d-flex flex-row ga-2">
      <h1 class="text-body-1 font-weight-bold">
        EXPEC HEDRA 7MG 100ML
      </h1>
      <v-badge inline color="primary" rounded="0" :content="$t('text.priceCollectionId.countProduct', {
        count: 0,
      })
        " />
    </div>
    <v-infinite-scroll height="80vh" :items="priceHistoryComputed" @load="load" :key="keyForInfiniteScroll">
      <template v-for="(item, index) in priceHistoryComputed" :key="index">
        <div>
          <LazyPartialListStoreItem :discount="item.discount" :value="item.value" :barcode="item.barcode"
            :description="item.description" :cnpj="item.cnpj" :address="item.endStreet + ', ' + item.endDistrict"
            :store-name="item.name" :telephone="item.phone" :unit="item.unit"/>
        </div>
      </template>
    </v-infinite-scroll>
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
import { useNotifyStore } from '~/store/notifyStore';
import type { GetPriceCollectionPriceHistory } from "~~/server/api/priceCollectionProduct/show";
import { LazyPartialListStoreItem } from "#components";


function validateIdParam(route: RouteLocationNormalized) {
  return (route.params.ean &&
    !isNaN(Number(route.params.ean))) as boolean;
}

definePageMeta({
  layout: "dashboard",
  validate: validateIdParam,
});

const dashboard = useDashboardStore();
const { getDateFromNowFormated } = useDateUtils();
const route = useRoute();
const { t } = useI18n();
const notifyStore = useNotifyStore();
const loading = ref(false);
const loadingImport = ref(false);
const { mobile } = useDisplay();
const keyForInfiniteScroll = ref(0);


const priceHistory = ref<GetPriceCollectionPriceHistory[]>([])

const maxValueHistory = computed(() => {
  return priceHistory.value.reduce((acc, item) => {
    return Math.max(acc, item.value);
  }, 0);
});

const priceHistoryComputed = computed(() => {
  return priceHistory.value.map((item) => {
    return {
      ...item,
      discount: (item.value / maxValueHistory.value * 100).toFixed(1),
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
}>({
  cityId: null,
  productEanOrDescription: null,
  storeCnpj: null,
});

onMounted(() => {
  dashboard.openBottomNavigation(BottomNavigationType.MY_SEARCHES);
});


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
      limit: 10,
      priceCollectionId: route.params.priceCollectionId,
      cityId: filters.value.cityId ?? undefined,
      productEanOrDescription: route.params.ean,
      storeCnpj: filters.value.storeCnpj ?? undefined,
    },
  })
    .then((res) => {
      console.log(res);
      if (res.length === 0) {
        done("empty");
      } else {
        priceHistory.value.push(...res);
        done("ok");
      }
    })
    .catch(() => {
      done("error");
    });
}

</script>