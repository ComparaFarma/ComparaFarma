<template>
  <NuxtLayout>
    <NuxtPage />
    <Analytics />
  </NuxtLayout>
</template>
<script setup lang="ts">
import configureValidate from '@/config/validate';
import { Analytics } from '@vercel/analytics/nuxt'
configureValidate();

</script>