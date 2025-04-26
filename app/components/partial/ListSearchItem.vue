<template>
  <div class="py-2 pr-4 ga-2">
    <v-row no-gutters class="py-2">
      <v-col cols="6" class="ga-2">
        <div class="d-flex flex-row align-center ga-2">
          <v-icon
            icon="mdi-barcode"
            size="40"
            color="grey"
          />
          <div class="d-flex flex-column ga-4">
            <div>
              {{ title ?? $t("words.undefined") }}
            </div>
            <div>
              <span v-t="'text.components.partialListSearchItem.city'" />
              <span class="font-weight-bold">
                {{ cities?.join(", ") ?? $t("words.undefined") }}
              </span>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="6" class="ga-2">
        <div class="d-flex flex-row align-center justify-end ga-2 text-right">
          <div class="d-flex flex-column ga-4">
            <div class="text-body-1 font-weight-bold">
              {{
                $t("text.components.partialListSearchItem.updatedAt", {
                  time: updatedAtString,
                })
              }}
            </div>

            <div>
              <span>
                {{
                  $t("text.components.partialListSearchItem.createdAt", {
                    time: createdAtString,
                  })
                }}
              </span>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters justify="space-between" class="ga-1">
      <v-col cols="12" lg="4">
        <v-btn color="primary" block @click="emit('visualize')">
          <v-icon
            icon="mdi-signal-cellular-outline"
            color="white"
            :alt="$t('words.visualize')"
            :title="$t('words.visualize')"
            class="mr-4"
          />
          <span v-t="'words.visualize'" />
        </v-btn>
      </v-col>
      <v-col :cols="mobile ? 12 : 1" class="d-flex justify-end">
        <v-btn
          color="error"
          :icon="!mobile"
          :block="!!mobile"
          size="small"
          @click="emit('delete')"
        >
          <v-icon icon="mdi-delete" size="24" />
          <span v-t="'words.delete'" v-show="mobile" />
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
  createdAt: {
    type: Date,
    required: true,
  },
  updateAt: {
    type: Date,
    default: null
  },
  cities: {
    type: Array as () => string[],
    default: null,
  },
});

const emit = defineEmits(["visualize", "delete"]);

const { mobile } = useDisplay();
const {t} = useI18n();

const { getDateFromNowFormated, getDateCalendarFormated } = useDateUtils();
const updatedAtString = computed(() => {
  if (!props.updateAt) {
    return t('words.undefined')
  }
  return getDateFromNowFormated(props.updateAt).toLowerCase();
});

const createdAtString = computed(() => {
  return getDateCalendarFormated(props.createdAt).toLowerCase();
});
</script>
