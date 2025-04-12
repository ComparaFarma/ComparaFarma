<template>
  <div>
    <v-row class="my-4">
      <v-col cols="12" lg="6">
        <div class="ga-2 d-flex" :class="{ 'flex-row': !mobile, 'flex-column': mobile }">
          <span class="px-4">
            <v-icon icon="mdi-map-marker" size="32" color="primary" class="mr-2" />
            <span v-t="'text.newSearch.createNewSearches'" class="text-uppercase text-subtitle-1 text-primary" />
          </span>
          <v-text-field :label="$t('text.newSearch.titleNewSearchTextField')" density="compact" hide-details="auto" />
          <v-select :label="$t('words.city', { count: 2 })" density="compact" multiple chips hide-details="auto" />
        </div>
      </v-col>
    </v-row>
    <v-row class="my-4 d-flex justify-center">
      <v-col cols="12" md="6">
        <v-card class="mx-auto border-md" variant="outlined" width="100%">
          <template v-slot:prepend>
            <span v-t="'text.newSearch.titleSearchProduct'" class="text-uppercase text-h6 text-grey-darken-3" />
          </template>
          <template v-slot:append>
            <div class="px-4 ga-4">
              <v-btn prepend-icon="mdi-import" variant="outlined" color="primary">
                <span v-t="'text.newSearch.importEanButton'" class="text-primary" />
              </v-btn>
            </div>
          </template>
          <v-card-text>
            <v-text-field :loading="loading" append-inner-icon="mdi-magnify"
              :label="$t('text.newSearch.searchTextField')" variant="underlined" hide-details single-line
              @click:append-inner="onClickSearch"></v-text-field>
          </v-card-text>
          <v-card-item>
            <v-infinite-scroll class="my-2 ml-4" height="23vh" :items="myProducts" @load="load">
              <template v-for="(item, index) in myProducts" :key="index">
                <div>
                  <LazyPartialListEanItem ean="00000000000000"  />
                  <v-divider v-if="index < items.length - 1" :key="'divider' + index" class="my-2" />
                </div>
              </template>
            </v-infinite-scroll>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="my-4">
      <v-col cols="12" class="d-flex justify-end">
        <v-btn prepend-icon="mdi-plus" color="primary">
          <span v-t="'text.newSearch.crateSearchButton'" class="text-withe" />
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
import auth from "../../ middleware/auth";
import { LazyPartialListEanItem } from "#components";
import type { PriceCollectionItem } from "~~/server/api/priceCollection";

const { t } = useI18n();

definePageMeta({
  layout: "dashboard",
  middleware: auth,
  name: "new-search",
});

useHead({
  title: t("text.mySearch.title"),
});

const { mobile } = useDisplay();
const items = ref(Array.from({ length: 30 }, (k, v) => v + 1));
const loading = ref(false);
const myProducts = ref<PriceCollectionItem[]>([]);

async function load({
  done,
}: {
  done: (status: "error" | "loading" | "empty" | "ok") => void;
}) {
  // Perform API call
  await $fetch("/api/priceCollection", {
    method: "GET",
    params: {
      offset: myProducts.value.length,
      limit: 10,
    },
  })
    .then((res) => {
      console.log(res);
      myProducts.value.push(...res);
      if (res.length === 0) {
        done("error");
      } else {
        done("ok");
      }
    })
    .catch((err) => {
      console.error(err);
      done("error");
    });
}

function onClickSearch() {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
}
</script>