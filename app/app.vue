<template>
  <NuxtLayout>
    <NuxtPage />
    <Analytics />
    <SpeedInsights />
  </NuxtLayout>
</template>
<script setup lang="ts">
import configureValidate from '@/config/validate';
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from "@vercel/speed-insights/nuxt"
configureValidate();

</script>