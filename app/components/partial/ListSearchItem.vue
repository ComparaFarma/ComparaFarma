<template>
  <div class="py-2 pr-4 ga-2">
    <v-row no-gutters class="py-2">
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
              {{ title ?? $t("words.undefined") }}
            </div>
            <div>
              <span v-t="'text.components.partialListSearchItem.city'" />
              <span class="font-weight-bold">
                {{ city ?? $t("words.undefined") }}
              </span>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="6" class="ga-2">
        <div class="d-flex flex-row align-center justify-end ga-2 text-right">
          <div class="d-flex flex-column ga-4">
            <div
              v-t="{
                path: 'text.components.partialListSearchItem.updateAt',
                args: { time: updatedAtString },
              }"
              class="text-body-1 font-weight-bold"
            />

            <div>
              <span
                v-t="{
                  path: 'text.components.partialListSearchItem.createdAt',
                  args: { time: createdAtString },
                }"
              />
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters justify="space-between">
      <v-col cols="12" lg="4" >
        <v-btn color="primary" block>
          <v-icon
            icon="mdi-signal-cellular-outline"
            color="white"
            :alt="$t('text.mySearch.edit')"
            :title="$t('text.mySearch.edit')"
            class="mr-4"
          />
          <span v-t="'words.visualize'" />
        </v-btn>
      </v-col>
      <v-col cols="1">
        <v-btn color="error" icon size="small">
          <v-icon
            icon="mdi-delete"
            size="24"
          />
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  updateAt: {
    type: Date,
    required: true,
  },
  city: {
    type: String,
    default: null,
  },
});
const { getDateFromNowFormated, getDateCalendarFormated } = useDateUtils();
const updatedAtString = computed(() => {
  return getDateFromNowFormated(props.updateAt);
});

const createdAtString = computed(() => {
  return getDateCalendarFormated(props.updateAt).toLowerCase();
});
</script>
