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
              <v-btn prepend-icon="mdi-import" variant="outlined" color="primary" @click="triggerFileInput">
                <span v-t="'text.newSearch.importEanButton'" class="text-primary" />
              </v-btn>
              <input type="file" ref="fileInput" style="display: none" @change="handleFileImport"
                accept=".csv,.xlsx,.txt">
            </div>
          </template>
          <v-card-text>
            <v-text-field :loading="loadingImport" append-inner-icon="mdi-magnify"
              :label="$t('text.newSearch.searchTextField')" variant="underlined" hide-details single-line
              :model="searchValue" 
              @update:model-value="onUpdateSearch"></v-text-field>
          </v-card-text>
          <v-card-item>
            <template v-if="filterMyProducts.length > 0">
              <v-virtual-scroll height="23vh" :items="filterMyProducts" @load="load">
                <template #default="{ item }">
                  <LazyPartialListEanItem :ean="item" />
                  <v-divider :key="'divider' + item" class="my-2" />
                </template>
              </v-virtual-scroll>
            </template>
            <template v-else>
              <div class="d-flex flex-column align-center justify-center h-100">
                <v-icon size="48" color="grey-lighten-1">mdi-package-variant-remove</v-icon>
                <p class="mt-2 text-grey">{{$t('$vuetify.noDataText')}}</p>
              </div>
            </template>
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
const loadingImport = ref(false);
const myProducts = ref<Array<string>>([]);
const filterMyProducts = ref<Array<string>>([]);
const searchValue = ref<string>("");

async function load({
  done,
}: {
  done: (status: "error" | "loading" | "empty" | "ok") => void;
}) {

}

function triggerFileInput() {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
}

async function handleFileImport(event: Event) {
  loadingImport.value = true;
  const fileInput = event.target as HTMLInputElement;

  if (!fileInput.files || fileInput.files.length === 0) {
    console.error('No file selected');
    return;
  }

  const file = fileInput.files[0] as File;

  const { importXlsx } = useImportXlsx()

  importXlsx(file).then((rows) => {
    console.log('Excel data:', rows);
    // Process your rows here
    const eans = rows.slice(1) // Skip header row
      .map(row => row[0]?.toString().trim());

    myProducts.value = eans as Array<string>;
    filterMyProducts.value = myProducts.value;
  }).catch((error) => {
    console.error('Error reading file:', error);
  }).finally(() => {
    loadingImport.value = false;
  });
}

function onUpdateSearch(value:string) {
  filterMyProducts.value = myProducts.value.filter((item) => {
    return item.toLowerCase().includes(value);
  });
  if (filterMyProducts.value.length === 0) {
    filterMyProducts.value = myProducts.value;
  } 
}
</script>