<template>
    <div class="py-2 pr-4 ga-2">
        <v-row no-gutters class="py-2">
            <v-col cols="10" class="ga-2">
                <div class="d-flex flex-row align-center ga-2">
                    <v-icon icon="mdi-barcode" size="40" color="grey" />
                    <span class="text-uppercase text-h6 text-grey-darken-3">{{ ean }} </span>
                </div>
            </v-col>
            <v-col cols="2" class="d-flex justify-end">
                <v-checkbox v-model="eanModel" color="primary" value="primary" hide-details   @change="emit('selected', $event)" />
            </v-col>
        </v-row>
    </div>
</template>
<script setup lang="ts">
const props = defineProps({
    ean: {
        type: String,
        required: true,
    }
});

const eanModel = ref(props.ean);

const emit = defineEmits(["selected"]);

</script>