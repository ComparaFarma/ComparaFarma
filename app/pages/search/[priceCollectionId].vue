<template>
    <div></div>
</template>
<script setup lang="ts">
import { BottomNavigationType, useDashboardStore } from '~/store/dashboardStore';


definePageMeta({
  layout: "dashboard",
});

const dashboard = useDashboardStore();
dashboard.openBottomNavigation(BottomNavigationType.MY_SEARCHES);
</script>