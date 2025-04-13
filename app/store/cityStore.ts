import { defineStore } from 'pinia'
import type { City } from '~~/server/api/city';

export const useCityStore = defineStore('city', {
  state: () => ({
      cities: [] as City[],
  }),
  actions: {
        async fetchCities() {
            const { data, error } = await useFetch('/api/city', {
                method: 'GET'
            });
            if (error.value) {
                throw new Error(error.value.message);
            }
            this.cities = data.value as City[];
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