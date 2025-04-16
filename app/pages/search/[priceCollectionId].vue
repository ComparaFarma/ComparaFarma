<template>
  <div class="d-flex flex-column my-5 ga-5">
    <div class="d-flex flex-row ga-2">
      <h1 class="text-body-1 font-weight-bold">
        {{ priceCollection?.name }}
      </h1>
      <v-badge
        inline
        color="primary"
        rounded="0"
        :content="
          $t('text.priceCollectionId.countProduct', {
            count: priceCollectionProducts.length,
          })
        "
      />
    </div>
    <v-row>
      <v-col cols="12" md="4">
        <v-card border>
          <v-card-title>
            <span v-t="'words.product'" class="text-h6 font-weight-black" />
          </v-card-title>
          <v-card-text>
            <v-text-field
              variant="underlined"
              :label="$t('text.priceCollectionId.searchEanOrDescription')"
              append-icon="mdi-magnify"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card border>
          <v-card-title>
            <span v-t="'words.concurrent'" class="text-h6 font-weight-black" />
          </v-card-title>
          <v-card-text>
            <v-text-field
              variant="underlined"
              :label="$t('text.priceCollectionId.searchEanOrDescription')"
              append-icon="mdi-magnify"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card border>
          <v-card-title>
            <span v-t="'words.city'" class="text-h6 font-weight-black" />
          </v-card-title>
          <v-card-text>
            <v-autocomplete
              variant="underlined"
              :label="$t('text.priceCollectionId.searchEanOrDescription')"
              append-icon="mdi-magnify"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
import {
  BottomNavigationType,
  useDashboardStore,
} from "~/store/dashboardStore";
import type { RouteLocationNormalized } from "vue-router";
import type { ViewPriceCollectionProduct } from "~~/server/api/priceCollectionProduct";
import type { PriceCollectionItem } from "~~/server/api/priceCollection";

function validateIdParam(route: RouteLocationNormalized) {
  console.log(route.params.priceCollectionId);
  return (route.params.priceCollectionId &&
    !isNaN(Number(route.params.priceCollectionId))) as boolean;
}

const { t } = useI18n();
definePageMeta({
  layout: "dashboard",
  validate: validateIdParam,
});

useHead({
  title: t("text.mySearch.title"),
});

const dashboard = useDashboardStore();
dashboard.openBottomNavigation(BottomNavigationType.MY_SEARCHES);
const route = useRoute();

const priceCollection = ref<PriceCollectionItem | null>(null);
const priceCollectionProducts = ref<ViewPriceCollectionProduct[]>([]);
onMounted(() => {
  $fetch("/api/priceCollection/show", {
    method: "GET",
    params: {
      id: route.params.priceCollectionId,
    },
  }).then((res) => {
    priceCollection.value = res;
  });

  $fetch("/api/priceCollectionProduct", {
    method: "GET",
    params: {
      priceCollectionId: route.params.priceCollectionId,
    },
  }).then((res) => {
    priceCollectionProducts.value = res;
  });
});
</script>
