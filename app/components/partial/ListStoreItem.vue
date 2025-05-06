<template>
    <v-card class="mx-auto" width="300" height="480" elevation="4">
        <v-card-text class="text-right">
            <v-badge v-if="discount != 0" inline color="success" rounded :content="$n(discount, 'percent')"><v-tooltip
                activator="parent"
                location="start"
                class="text-center text-white font-weight-bold"
              >{{$t('text.components.partialListStoreItem.discountTooltip',{discount:$n(discount, 'percent')})}}</v-tooltip></v-badge>  
        </v-card-text>

        <v-card-item class="text-center pt-0">
            <v-img :src="getImageUrl()" height="100" width="150" class="mx-auto" contain>
                <template #error>
                    <v-img class="mx-auto" height="300" max-width="500" src="~/assets/stores/default.png" />
                </template>
            </v-img>
        </v-card-item>

        <v-divider/>

        <v-card-text class="text-center">
            <div>
                <span class="text-h4 font-weight-bold">{{ $n(value, 'currency') }}</span><span>{{ $t('text.components.partialListStoreItem.unit',{unit}) }}</span>
            </div>
            <div class="text-subtitle-1 mt-2">{{ description }}</div>
        </v-card-text>
        <v-card-text class="ga-2 pt-0 ">
            <div class="d-flex flex-row ga-2">
                <v-icon class="flex-col my-auto" icon="mdi-barcode" size="20" color="grey" />
                <span class="flex-col text-subtitle-1 mt-1">{{ barcode }}</span>
            </div>
            <div class="d-flex flex-row ga-2">
                <v-icon class="flex-col my-auto" icon="mdi-store" size="20" color="grey" />
                <span class="flex-col text-subtitle-2 mt-1 multiline-truncate-2" :title="storeName">{{ storeName }}</span>
            </div>
            <div class="d-flex flex-row ga-2">
                <v-icon class="flex-col my-auto" icon="mdi-account" size="20" color="grey" />
                <span class="flex-col text-subtitle-2 mt-1">{{ cnpj }}</span>
            </div>
            <div class="d-flex flex-row ga-2">
                <v-icon class="flex-col my-auto" icon="mdi-map-marker" size="20" color="grey" />
                <span class="flex-col text-subtitle-2 mt-1 text-truncate" :title="address">{{ address }}</span>
            </div>
            <div class="d-flex flex-row ga-2">
                <v-icon class="flex-col my-auto" icon="mdi-phone" size="20" color="grey" />
                <span class="flex-col text-subtitle-2 mt-1">{{ telephone ?? '--' }}</span>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
const props = defineProps({
    discount: {
        type: Number,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        default: 'UND',
    },
    barcode: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    cnpj: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    storeName: {
        type: String,
        required: true,
    },
    telephone: {
        type: String,
        default: null,
        required: false,
    },
});

function getImageUrl() {
    return new URL(`/assets/stores/${props.storeName}.png`, import.meta.url).href;
}

</script>

<style scoped lang="scss">
.multiline-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
  }
</style>