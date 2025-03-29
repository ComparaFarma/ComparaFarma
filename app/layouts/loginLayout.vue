<template>
  <v-app>
    <v-container class="fill-height" fluid>
      <v-row justify="center" align="center">
        <v-col :cols="0" md="6" align="center">
          <v-img
            src="~/assets/logo.svg"
            max-width="500"
            max-height="500"
            contain
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-col cols="12" md="10" class="d-flex flex-column ga-3">
            <v-main>
              <slot />
            </v-main>
          </v-col>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
