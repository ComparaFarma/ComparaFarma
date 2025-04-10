<template>
  <div class="py-2 pr-4">
    <v-row>
      <v-col cols="6" class="ga-2">
        <div class="d-flex flex-row align-center ga-2">
          <v-icon
            icon="mdi-barcode"
            size="40"
            color="grey"
            :alt="$t('text.mySearch.search')"
            :title="$t('text.mySearch.search')"
          />
          <div class="d-flex flex-column ga-4">
            <div>
              {{ description ?? $t('words.undefined') }}
            </div>
            <div>
              <span v-t="'words.city'"/>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="6" class="ga-2">
        <div class="d-flex flex-row align-center ga-2">
          <div class="d-flex flex-column ga-4">
            <div class="text-body-1 font-weight-bold">
              {{ $t('text.components.partialListSearchItem.updateAt', {time: updatedAtString}) }}
            </div>
            <div>
              <span v-t="'words.date'"/>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">


const props = defineProps({
  description: {
    type: String,
    default: null
  },
  updateAt: {
    type: Date,
    required: true,
  }
});
 const { getDateFromNow } = useDateUtils();
 const updatedAtString = computed(() => {
  return getDateFromNow(props.updateAt);
 })
</script>
