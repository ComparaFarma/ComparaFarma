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
            count: priceCollection?.countproduct,
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
    <v-infinite-scroll
      height="60vh"
      :items="priceCollectionProducts"
      @load="load"
      :key="keyForInfiniteScroll"
    >
      <v-expansion-panels class="d-flex flex-row ga-1">
        <v-expansion-panel
          v-for="(item, index) in priceCollectionProducts"
          :key="index"
          class="text-body-1"
          :title="item.description ?? $t('words.undefined')"
        >
          <template #text>
            <v-row align="center" justify="space-between">
              <v-col cols="12" md="3">
                <v-img
                  :src="item.image ?? undefined"
                  :alt="item.description ?? undefined"
                  max-height="170px"
                />
              </v-col>
              <v-col cols="12" md="5">
                <v-row
                  justify="center"
                  align="center"
                  align-content="center"
                  class="mb-1"
                >
                  <v-col cols="6">
                    <v-row class="ga-2" align="center">
                      <span
                        v-t="'text.priceCollectionId.minPrice'"
                        class="text-body-1 font-weight-black text-success price-collection-item"
                      />
                      <div class="d-flex flex-column ga-2">
                        <p class="text-h4 font-weight-bold">
                          {{ $n(item.minvalue ?? 0, "currency") }}
                        </p>
                        <p>{{ item.minvaluestorename }}</p>
                      </div>
                    </v-row>
                  </v-col>
                  <v-col cols="6">
                    <v-row class="ga-2" align="center">
                      <span
                        v-t="'text.priceCollectionId.maxPrice'"
                        class="text-body-1 font-weight-black text-secondary price-collection-item"
                      />
                      <div class="d-flex flex-column ga-2">
                        <p class="text-h4 font-weight-bold">
                          {{ $n(item.maxvalue ?? 0, "currency") }}
                        </p>
                        <p>{{ item.maxvaluestorename }}</p>
                      </div>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row align="center" class="ga-1 mb-1">
                  <v-icon icon="mdi-barcode" size="40" color="grey" />
                  <span v-t="'words.barcode'" class="text-subtitle-1" />
                  <span class="text-subtitle-1 font-weight-bold">{{
                    item.barcode
                  }}</span>
                </v-row>
                <v-row class="mb-1">
                  <span>{{
                    $t("text.priceCollectionId.updatedAt", {
                      time: item.lastupdateat
                        ? getDateFromNowFormated(new Date(item.lastupdateat))
                        : $t("words.undefined"),
                    })
                  }}</span>
                </v-row>
              </v-col>
              <v-col cols="12" md="3">
                <v-row justify="end">
                  <v-btn color="primary" size="large" :block="mobile">
                    <span class="text-none text-h6">
                      {{
                        $t("text.priceCollectionId.compareStore", {
                          count: item.countstore,
                        })
                      }}
                    </span>
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-infinite-scroll>
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
  return (route.params.priceCollectionId &&
    !isNaN(Number(route.params.priceCollectionId))) as boolean;
}
const { getDateFromNowFormated } = useDateUtils();
definePageMeta({
  layout: "dashboard",
  validate: validateIdParam,
});
const { mobile } = useDisplay();
const dashboard = useDashboardStore();
const keyForInfiniteScroll = ref(0);
dashboard.openBottomNavigation(BottomNavigationType.MY_SEARCHES);
const route = useRoute();

const priceCollection = ref<PriceCollectionItem | null>(null);
const priceCollectionProducts = ref<ViewPriceCollectionProduct[]>([]);

onMounted(() => {
  dashboard.setReloadCallback(async () => {
    // Reload the page
    priceCollectionProducts.value = [];
    keyForInfiniteScroll.value++;
  });
  $fetch("/api/priceCollection/show", {
    method: "GET",
    params: {
      id: route.params.priceCollectionId,
    },
  }).then((res) => {
    priceCollection.value = res;
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
.price-collection-item {
  width: 48px;
}
</style>
