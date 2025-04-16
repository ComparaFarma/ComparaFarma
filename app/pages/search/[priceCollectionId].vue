<template>
    <div></div>
</template>
<script setup lang="ts">
import { BottomNavigationType, useDashboardStore } from '~/store/dashboardStore';
import type { RouteLocationNormalized } from 'vue-router'

function validateIdParam(route: RouteLocationNormalized) {
  console.log(route.params.priceCollectionId);
  return (route.params.priceCollectionId && !isNaN(Number(route.params.priceCollectionId))) as boolean;
}

const { t } = useI18n();
definePageMeta({
  layout: "dashboard",
  validate: validateIdParam,
});

useHead({
  title: t("text.mySearch.title"),
});

const dashboard = useDashboardStore();
dashboard.openBottomNavigation(BottomNavigationType.MY_SEARCHES);
const route = useRoute()
onMounted(() => {
  $fetch('/api/priceCollection/show', {
    method: 'GET',
    params: {
      id: route.params.priceCollectionId,
    },
  })

  $fetch('/api/priceCollectionProduct', {
    method: 'GET',
    params: {
      priceCollectionId: route.params.priceCollectionId,
    },
  })
})
</script>