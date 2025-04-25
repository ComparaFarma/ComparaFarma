<template>
  <div>
    <v-row class="my-4">
      <v-col cols="12" lg="6">
        <div class="ga-2 d-flex" :class="{ 'flex-row': !mobile, 'flex-column': mobile }">
          <span class="px-4">
            <v-icon icon="mdi-map-marker" size="32" color="primary" class="mr-2" />
            <span v-t="'text.newSearch.createNewSearches'" class="text-uppercase text-subtitle-1 text-primary" />
          </span>
          <v-text-field v-model="title" :label="$t('text.newSearch.titleNewSearchTextField')" density="compact"
            hide-details="auto" v-bind="titleProps" :error-messages="errors.title" />

          <v-autocomplete v-model="cities" :label="$t('words.city', { count: 2 })" density="compact" variant="outlined"
            multiple chips hide-details="auto" v-bind="citiesProps" :items="cityStore.cities" item-title="name"
            item-value="id" />

        </div>
      </v-col>
    </v-row>
    <v-row class="my-4 d-flex justify-center">
      <v-col cols="12" md="6">
        <v-card class="mx-auto border-md" variant="outlined" width="100%">
          <template v-slot:prepend>
            <section class="d-flex ga-2">
              <span v-t="'text.newSearch.titleSearchProduct'" class="text-uppercase text-grey-darken-3"
                :class="mobile ? 'text-subtitle-2' : 'text-h6'" />
              <v-chip v-if="!mobile" variant="elevated">
                {{ countEans }}
              </v-chip>
            </section>
          </template>

          <template v-slot:append>
            <div class="px-2" :class="{ 'd-flex flex-column ga-2': mobile, 'd-flex align-center ga-4': !mobile }">
              <v-btn prepend-icon="mdi-download-box-outline" variant="outlined" color="success"
                :size="mobile ? 'x-small' : 'small'" :class="mobile ? 'w-100' : 'mr-2'" @click="triggerFileDownload">
                <span v-t="'text.newSearch.downloadModelImportButton'" class="text-success" />
              </v-btn>

              <v-btn prepend-icon="mdi-import" variant="outlined" color="primary" :size="mobile ? 'x-small' : 'small'"
                @click="triggerFileInput">
                <span v-t="'text.newSearch.importEanButton'" class="text-primary" />
              </v-btn>

              <input ref="fileInput" type="file" style="display: none" accept=".csv,.xlsx,.txt"
                @change="handleFileImport">
            </div>
          </template>
          <v-card-text>
            <v-text-field append-inner-icon="mdi-magnify" :label="$t('text.newSearch.searchTextField')"
              variant="underlined" hide-details single-line :model="searchValue"
              @update:model-value="onUpdateSearch"></v-text-field>
          </v-card-text>
          <v-card-item>
            <template v-if="loadingImport">
              <div class="d-flex flex-column align-center justify-center h-100">
                <v-progress-circular indeterminate color="primary" />
                <p class="mt-2 text-grey">{{ $t('text.newSearch.loadingImport') }}</p>
              </div>
            </template>
            <template v-if="filterMyProducts.length > 0">
              <v-virtual-scroll height="23vh" :items="filterMyProducts">
                <template #default="{ item }">
                  <LazyPartialListEanItem :ean="item" :eans="selectedEans" @change="onChangeEan" />
                  <v-divider :key="'divider' + item" class="my-2" />
                </template>
              </v-virtual-scroll>
            </template>
            <template v-else>
              <div class="d-flex flex-column align-center justify-center h-100">
                <v-icon size="48" color="grey-lighten-1">mdi-package-variant-remove</v-icon>
                <p class="mt-2 text-grey">{{ $t('$vuetify.noDataText') }}</p>
              </div>
            </template>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="my-4">
      <v-col cols="12" class="ga-2 d-flex justify-end">
        <v-btn v-if="myProducts.length > 0" prepend-icon="mdi-cancel" color="secondary">
          <span v-t="'text.newSearch.clearSearchImportButton'" class="text-withe" @click="clearImport" />
        </v-btn>
        <v-btn prepend-icon="mdi-plus" color="primary" @click="createNewSearch">
          <span v-t="'text.newSearch.crateSearchButton'" class="text-white" />
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
import auth from "../../ middleware/auth";
import { LazyPartialListEanItem } from "#components";
import { useForm } from 'vee-validate';
import { useNotifyStore } from '~/store/notifyStore';
import { useCityStore } from "~/store/cityStore";


const { t } = useI18n();
const notifyStore = useNotifyStore();


definePageMeta({
  layout: "dashboard",
  middleware: auth,
  name: "create",
});

useHead({
  title: t("text.mySearch.title"),
});

const { mobile } = useDisplay();
const loading = ref(false);
const loadingImport = ref(false);
const myProducts = ref<Array<string>>([]);
const filterMyProducts = ref<Array<string>>([]);
const searchValue = ref<string>("");

const cityStore = useCityStore();

// Configuração do formulário com validação
const { defineField, errors, validate } = useForm({
  validationSchema: {
    title: 'required',
    cities: 'required'
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const vuetifyConfig = (state: any) => ({
  props: {
    "error-messages": state.errors,
  },
});

const [title, titleProps] = defineField("title", vuetifyConfig);
const [cities, citiesProps] = defineField("cities", vuetifyConfig);
const selectedEans = ref<Array<string>>([]);

const countEans = computed(() => {
  return selectedEans.value.length;
});


function triggerFileInput() {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
}

function triggerFileDownload() {
  const link = document.createElement('a')
  link.href = '/model-import.xlsx' // Caminho direto para o arquivo em /public
  link.download = 'modelo-importacao.xlsx' // Nome que aparecerá no download
  link.click()
}

async function handleFileImport(event: Event) {
  loadingImport.value = true;

  const fileInput = event.target as HTMLInputElement;

  if (!fileInput.files || fileInput.files.length === 0) {
    console.error('No file selected');
    return;
  }

  const file = fileInput.files[0] as File;

  const { importXlsx } = useImportXlsx(t)

  importXlsx(file).then((rows) => {
    console.log('Excel data:', rows);
    // Process your rows here
    const eans = rows.slice(1) // Skip header row
      .map(row => row[0]?.toString().trim());

    myProducts.value = eans as Array<string>;
    filterMyProducts.value = myProducts.value;
    selectedEans.value = eans as Array<string>;
  }).catch((error) => {
    notifyStore.showNotification(t('text.newSearch.notify.errorReadFile'), 'error');
    console.error('Error reading file:', error);
  }).finally(() => {
    loadingImport.value = false;
  });
}

function onUpdateSearch(value: string) {
  filterMyProducts.value = myProducts.value.filter((item) => {
    return item.toLowerCase().includes(value);
  });
  if (filterMyProducts.value.length === 0) {
    filterMyProducts.value = myProducts.value;
  }
}

function clearImport() {
  myProducts.value = [];
  filterMyProducts.value = [];
  searchValue.value = "";
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }

  selectedEans.value = [];
  title.value = "";
  cities.value = [];
}

function onChangeEan(event: { target: { checked: boolean; value: string } }) {
  const { checked, value } = event.target;

  if (checked) {
    selectedEans.value.push(value);
  } else {
    selectedEans.value = selectedEans.value.filter((item) => item !== value);
  }
}

async function createNewSearch() {
  loading.value = true;

  // Validação dos campos
  const { valid } = await validate();

  // Validação adicional para os EANs
  if (!selectedEans.value || selectedEans.value.length === 0) {
    notifyStore.showNotification(t('text.newSearch.notify.requireProduct'), 'error');
    loading.value = false;
    return;
  }

  if (!valid) {
    loading.value = false;
    return;
  }

  await $fetch('/api/priceCollection/create', {
    method: 'POST',
    body: {
      name: title.value,
      cities: cities.value,
      products: selectedEans.value
    }
  }).then((res) => {
    console.log(res);
    notifyStore.showNotification(t('text.newSearch.notify.success'), 'success');
    clearImport();
  }).catch((error) => {
    console.error(t('text.newSearch.notify.error'), error);
    notifyStore.showNotification(
      error.message || 'Erro ao criar pesquisa',
      'error'
    );
  });
}
</script>