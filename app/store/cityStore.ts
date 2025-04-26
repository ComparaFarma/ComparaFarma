import { defineStore } from 'pinia'
import type { City } from '~~/server/api/city';

export const useCityStore = defineStore('city', {
  state: () => ({
      cities: [] as City[],
  }),
  actions: {
        async fetchCities() {
            await $fetch('/api/city', {
                method: 'GET'
            }).catch((error) => {
                throw new Error(error.value.message);
            }
            ).then((data) => {
                this.cities = data as City[];
            });
        },
        getCityById(id: number) {
            return this.cities.find(city => city.id === id);
        },
        getCityByName(name: string) {
            return this.cities.find(city => city.name === name);
        },
        getCityByIds(ids: number[]) {
            return this.cities.filter(city => ids.includes(city.id));
        }
  }
})