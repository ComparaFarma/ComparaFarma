<template>
    <v-card class="mx-auto" width="350" min-height="550" elevation="4">
        <v-card-text class="text-right">
            <v-badge inline color="success" rounded :content="discount + '%'" />
        </v-card-text>

        <v-card-item class="text-center pt-0">
            <v-img :src="getImageUrl()" height="100" width="150" class="mx-auto" contain>
                <template v-slot:error>
                    <v-img class="mx-auto" height="300" max-width="500" src="~/assets/stores/default.png" />
                </template>
            </v-img>
        </v-card-item>

        <v-divider></v-divider>

        <v-card-text class="text-center">
            <div>
                <span class="text-h4 font-weight-bold">{{ value }}</span><span>{{ `/${unit}` }}</span>
            </div>
            <div class="text-subtitle-1 mt-2">{{ description }}</div>
        </v-card-text>
        <v-card-text>
            <div class="d-flex flex-row ga-2">
                <v-icon class="flex-col" icon="mdi-barcode" size="40" color="grey" />
                <span class="flex-col text-subtitle-1 mt-1">{{ barcode }}</span>
            </div>
            <div class="d-flex flex-row ga-2">
                <v-icon class="flex-col" icon="mdi-store" size="40" color="grey" />
                <span class="flex-col text-subtitle-1 mt-1">{{ storeName }}</span>
            </div>
            <div class="d-flex flex-row ga-2">
                <v-icon class="flex-col" icon="mdi-account" size="40" color="grey" />
                <span class="flex-col text-subtitle-1 mt-1">{{ cnpj }}</span>
            </div>
            <div class="d-flex flex-row ga-2">
                <v-icon class="flex-col" icon="mdi-map-marker" size="40" color="grey" />
                <span class="flex-col text-subtitle-1 mt-1">{{ address }}</span>
            </div>
            <div class="d-flex flex-row ga-2">
                <v-icon class="flex-col" icon="mdi-phone" size="40" color="grey" />
                <span class="flex-col text-subtitle-1 mt-1">{{ telephone ?? '--' }}</span>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
const props = defineProps({
    discount: {
        type: String,
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
        required: true,
    },
});

function getImageUrl() {
    return new URL(`/assets/stores/${props.barcode}`, import.meta.url).href;
}

</script>

<style scoped lang="scss">
</style>