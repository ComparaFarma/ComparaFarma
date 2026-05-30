<template>
  <div class="create-search-page">
    <!-- Hero Header Section -->
    <v-card 
      class="hero-header mb-3 overflow-hidden" 
      elevation="0"
      :class="mobile ? 'rounded-lg' : 'rounded-xl'"
    >
      <div class="hero-gradient pa-6 pa-md-8">
        <div class="d-flex align-center mb-4">
          <div class="icon-wrapper mr-4">
            <v-icon icon="mdi-map-marker" size="40" color="white" />
          </div>
          <div>
            <h1 
              v-t="'text.newSearch.createNewSearches'" 
              class="text-h5 text-md-h4 font-weight-bold text-white mb-1"
            />
          </div>
        </div>

        <!-- Form Fields -->
        <v-row class="mt-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="title"
              :label="$t('text.newSearch.titleNewSearchTextField')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              v-bind="titleProps"
              :error-messages="errors.title"
              bg-color="white"
              rounded="lg"
              prepend-inner-icon="mdi-text"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="cities"
              :label="$t('words.city', { count: 2 })"
              variant="outlined"
              density="comfortable"
              multiple
              chips
              hide-details="auto"
              v-bind="citiesProps"
              :items="cityStore.cities"
              item-title="name"
              item-value="id"
              bg-color="white"
              rounded="lg"
              prepend-inner-icon="mdi-map-marker-multiple"
            />
          </v-col>
        </v-row>
      </div>
    </v-card>

    <!-- File Operations Card -->
    <v-card 
      class="file-operations-card mb-3 overflow-hidden"
      :class="mobile ? 'rounded-lg' : 'rounded-xl'"
      elevation="2"
    >
      <div class="gradient-border"/>
      <v-card-title class="d-flex align-center pa-4 flex-wrap">
        <v-icon icon="mdi-file-document-multiple" size="28" color="primary" class="mr-3" />
        <span class="text-h6 font-weight-bold">{{ $t('text.newSearch.titleSearchProduct') }}</span>
        <v-spacer />
        <v-chip 
          color="primary" 
          variant="elevated"
          size="large"
          class="font-weight-bold"
        >
          {{ countEans }}
        </v-chip>
        <div class="ml-4 d-flex flex-column" style="min-width:220px">
          <div class="text-caption font-weight-bold text-secondary">
            {{ $t('text.newSearch.estimatedRequests', { count: totalEstimatedRequests.toLocaleString('pt-BR') }) }}
          </div>
          <div class="text-caption text-grey--text mt-1">
            {{ $t('text.newSearch.calculatedBasedOn', { days: daysInMonth, cities: citiesCount, products: countEans, total: totalEstimatedRequests.toLocaleString('pt-BR') }) }}
          </div>
        </div>
      </v-card-title>
      
      <v-divider />

      <v-card-text class="pa-3 pa-md-4">
        <!-- Upload/Download Section -->
        <v-row class="mb-3">
          <v-col cols="12" md="6">
            <v-card 
              class="download-card pa-4 text-center h-100"
              variant="tonal"
              color="success"
              :rounded="mobile ? 'lg' : 'xl'"
              style="cursor: pointer; transition: all 0.3s ease;"
              hover
              @click="triggerFileDownload"
            >
              <v-icon icon="mdi-download-box-outline" size="48" color="success" class="mb-2" />
              <h3 class="text-subtitle-1 font-weight-bold text-success mb-2">
                {{ $t('text.newSearch.downloadModelImportButton') }}
              </h3>
              <p class="text-caption text-grey-darken-1 mb-0">
                {{ $t('text.newSearch.downloadDescription') }}
              </p>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card 
              class="upload-card pa-4 text-center h-100"
              variant="tonal"
              color="primary"
              :rounded="mobile ? 'lg' : 'xl'"
              :class="{ 'dragging': isDragging }"
              style="cursor: pointer; transition: all 0.3s ease;"
              hover
              @click="triggerFileInput"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
            >
              <v-icon icon="mdi-cloud-upload" size="48" color="primary" class="mb-2" />
              <h3 class="text-subtitle-1 font-weight-bold text-primary mb-2">
                {{ $t('text.newSearch.importEanButton') }}
              </h3>
              <p class="text-caption text-grey-darken-1 mb-2">
                {{ $t('text.newSearch.uploadDescription') }}
              </p>
              <p class="text-caption text-grey mb-0">
                {{ $t('text.newSearch.uploadFormats') }}
              </p>
              <input
                ref="fileInput"
                type="file"
                style="display: none"
                accept=".csv,.xlsx,.txt"
                @change="handleFileImport"
              >
            </v-card>
          </v-col>
        </v-row>

        <!-- Search Field -->
        <v-text-field
          append-inner-icon="mdi-magnify"
          :label="$t('text.newSearch.searchTextField')"
          variant="outlined"
          hide-details
          single-line
          :model="searchValue"
          rounded="lg"
          class="mb-3"
          density="comfortable"
          bg-color="grey-lighten-5"
          @update:model-value="onUpdateSearch"
        />

        <!-- Product List -->
        <v-card 
          variant="outlined" 
          :rounded="mobile ? 'lg' : 'xl'"
          class="product-list-container"
        >
          <template v-if="loadingImport">
            <div class="d-flex flex-column align-center justify-center pa-8">
              <v-progress-circular 
                indeterminate 
                color="primary" 
                size="64"
                width="6"
              />
              <p class="mt-4 text-body-1 text-grey">{{ $t('text.newSearch.loadingImport') }}</p>
            </div>
          </template>
          
          <template v-else-if="filterMyProducts.length > 0">
            <v-virtual-scroll height="400px" :items="filterMyProducts" class="pa-2">
              <template #default="{ item }">
                <LazyPartialListEanItem 
                  :ean="item" 
                  :eans="selectedEans" 
                  class="product-item"
                  @change="onChangeEan"
                />
                <v-divider :key="'divider' + item" class="my-1" />
              </template>
            </v-virtual-scroll>
          </template>
          
          <template v-else>
            <div class="d-flex flex-column align-center justify-center pa-8">
              <v-icon size="64" color="grey-lighten-1">mdi-package-variant-remove</v-icon>
              <p class="mt-4 text-body-1 text-grey">{{ $t('$vuetify.noDataText') }}</p>
              <p class="text-caption text-grey-lighten-1">{{ $t('text.newSearch.emptyStateMessage') }}</p>
            </div>
          </template>
        </v-card>
      </v-card-text>
    </v-card>

    <!-- Action Buttons -->
    <v-card 
      class="action-bar pa-4"
      :class="mobile ? 'fixed-bottom' : 'rounded-xl'"
      elevation="4"
    >
      <div class="d-flex justify-end ga-3" :class="{ 'flex-column': mobile }">
        <v-btn
          v-if="myProducts.length > 0"
          prepend-icon="mdi-cancel"
          color="secondary"
          :disabled="loading"
          variant="outlined"
          :size="mobile ? 'large' : 'default'"
          :block="mobile"
          @click="clearImport"
        >
          <span v-t="'text.newSearch.clearSearchImportButton'" />
        </v-btn>
        
        <v-btn
          prepend-icon="mdi-plus"
          color="primary"
          :loading="loading"
          :disabled="!canCreate || loading"
          variant="elevated"
          :size="mobile ? 'large' : 'default'"
          :block="mobile"
          class="font-weight-bold"
          @click="createNewSearch"
        >
          <span v-t="'text.newSearch.crateSearchButton'" class="text-white" />
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { LazyPartialListEanItem } from "#components";
import { useForm } from 'vee-validate';
import { useNotifyStore } from '~/store/notifyStore';
import { useCityStore } from "~/store/cityStore";
import {
  BottomNavigationType,
  useDashboardStore,
} from "~/store/dashboardStore";


const { t } = useI18n();
const notifyStore = useNotifyStore();


definePageMeta({
  layout: "dashboard",
  middleware: "auth",
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
const isDragging = ref(false);

const cityStore = useCityStore();
const dashboard = useDashboardStore();

const usageRemaining = ref<number | null>(null);

onMounted(() => {
  dashboard.openBottomNavigation(BottomNavigationType.CREATE_SEARCH);
  // Busca uso da assinatura para controlar disponibilidade de criação
  (async () => {
    try {
      const usage = await $fetch('/api/subscription/usage');
      usageRemaining.value = usage?.remainingRequests !== undefined ? usage.remainingRequests : null;
    } catch (err) {
      console.error('Failed to fetch subscription usage', err);
      usageRemaining.value = null;
    }
  })();
});

// Configuração do formulário com validação
const { defineField, errors, validate, resetForm } = useForm({
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

const daysInMonth = computed(() => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
});

const citiesCount = computed(() => Array.isArray(cities.value) ? cities.value.length : 0);

const estimatedRequestsPerProduct = computed(() => daysInMonth.value * citiesCount.value);

const totalEstimatedRequests = computed(() => selectedEans.value.length * estimatedRequestsPerProduct.value);

const requiredRequests = computed(() => {
  return selectedEans.value.length * estimatedRequestsPerProduct.value;
});

const canCreate = computed(() => {
  if (usageRemaining.value === null) return true; // desconhecido ainda
  return usageRemaining.value >= requiredRequests.value;
});


function triggerFileInput() {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
}

function triggerFileDownload() {
  const link = document.createElement('a')
  link.href = '/import-model.xlsx'
  link.download = 'import-model.xlsx'
  link.click()
}

function handleFileDrop(event: DragEvent) {
  isDragging.value = false;
  
  if (!event.dataTransfer?.files || event.dataTransfer.files.length === 0) {
    return;
  }

  const file = event.dataTransfer.files[0];
  processFile(file);
}

async function handleFileImport(event: Event) {
  const fileInput = event.target as HTMLInputElement;

  if (!fileInput.files || fileInput.files.length === 0) {
    console.error('No file selected');
    return;
  }

  const file = fileInput.files[0] as File;
  processFile(file);
}

async function processFile(file: File) {
  loadingImport.value = true;

  const { importXlsx } = useImportXlsx()

  importXlsx(file).then((rows) => {
    console.log('Excel data:', rows);
    // Process your rows here
    const eans = rows.slice(1) // Skip header row
      .map(row => row[0]?.toString().trim());

    if (eans.length === 0) {
      notifyStore.showNotification(t('text.newSearch.notify.errorEmptyFile'), 'error');
      loadingImport.value = false;
      return;
    }

    myProducts.value = eans as Array<string>;
    filterMyProducts.value = myProducts.value;
    selectedEans.value = eans as Array<string>;
    
    notifyStore.showNotification(
      t('text.newSearch.notify.successImport', { count: eans.length }),
      'success'
    );
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
  selectedEans.value = [];
  myProducts.value = [];
  filterMyProducts.value = [];
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }

  resetForm();
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

  if (!canCreate.value) {
    notifyStore.showNotification(t('text.newSearch.notify.limitReached'), 'error');
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
    // Atualiza uso localmente subtraindo o que foi consumido
    if (usageRemaining.value !== null) {
      usageRemaining.value = Math.max(0, usageRemaining.value - requiredRequests.value);
    }
  }).catch((error) => {
    console.error(t('text.newSearch.notify.error'), error);
    notifyStore.showNotification(
      error.message || t('text.newSearch.notify.error'),
      'error'
    );
  });
  loading.value = false;
}
</script>

<style scoped lang="scss">
.create-search-page {
  width: 100%;
  padding-bottom: 80px;

  @media (max-width: 960px) {
    padding-bottom: 120px;
  }
}

.hero-header {
  position: relative;
  overflow: hidden;
}

.hero-gradient {
  background: linear-gradient(135deg, #0055A5 0%, #003d7a 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: pulse 8s ease-in-out infinite;
  }

  // Fix floating labels to have white background
  :deep(.v-field__outline) {
    .v-label {
      background: white;
      padding: 0 4px;
    }
  }
}

.icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 12px;
  backdrop-filter: blur(10px);
}

.file-operations-card {
  position: relative;
  
  .gradient-border {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #0055A5 0%, #003d7a 100%);
  }
}

.download-card, .upload-card {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}

.upload-card.dragging {
  border: 2px dashed #0055A5;
  background: rgba(0, 85, 165, 0.1);
  transform: scale(1.02);
}

.product-list-container {
  transition: all 0.3s ease;
}

.product-item {
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 85, 165, 0.05);
  }
}

.action-bar {
  background: white;
  
  &.fixed-bottom {
    position: fixed;
    bottom: 56px;
    left: 0;
    right: 0;
    z-index: 5;
    border-radius: 0;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

// Smooth transitions for all interactive elements
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>