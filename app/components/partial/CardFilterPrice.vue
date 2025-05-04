<template>
    <div>
      <v-card :class="fabPosition === 'absolute' ? 'demo-panel-relative' : 'demo-panel-static'" border flat>
        <v-fab
          :key="fabPosition"
          :absolute="fabPosition === 'absolute'"
          :app="fabPosition === 'fixed'"
          :color="open ? '' : 'primary'"
          :location="fabLocation"
          size="large"
          icon
        >
          <v-icon>{{ open ? 'mdi-close' : 'mdi-filter' }}</v-icon>
          <v-speed-dial 
            v-model="open" 
            location="bottom center" 
            transition="slide-y" 
            activator="parent"
            direction="right"
            class="speed-dial-content"
          >
            <!-- Card de filtro de preço -->
            <v-card width="300" class="pa-4 filter-card">
              <v-card-title class="text-h6">Filtrar por Preço</v-card-title>
              
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="minPrice"
                      label="Mínimo"
                      type="number"
                      prefix="R$"
                      step="0.01"
                      min="0"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="maxPrice"
                      label="Máximo"
                      type="number"
                      prefix="R$"
                      step="0.01"
                      :min="minPrice"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                </v-row>
                
                <div class="text-caption mb-2">Ou selecione uma faixa:</div>
                
                <v-radio-group v-model="selectedPriceRange" @update:modelValue="applyRange">
                  <v-radio
                    label="R$ 0,00 até R$ 5,00"
                    value="0-5"
                    density="comfortable"
                  ></v-radio>
                  <v-radio
                    label="R$ 5,01 até R$ 7,00"
                    value="5.01-7"
                    density="comfortable"
                  ></v-radio>
                  <v-radio
                    label="R$ 7,01 até R$ 9,00"
                    value="7.01-9"
                    density="comfortable"
                  ></v-radio>
                </v-radio-group>
              </v-card-text>
              
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                  color="primary" 
                  variant="text" 
                  size="small"
                  @click="applyPriceFilter"
                >
                  Aplicar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-speed-dial>
        </v-fab>
      </v-card>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        open: false,
        fabPosition: 'none',
        fabLocation: 'bottom end',
        minPrice: 0,
        maxPrice: 20,
        selectedPriceRange: null
      }
    },
    methods: {
      applyPriceFilter() {
        // Implemente sua lógica de filtragem aqui
        console.log('Filtrando por preço:', {
          min: this.minPrice,
          max: this.maxPrice
        });
        
        this.open = false; // Fecha o speed dial após aplicar
      },
      applyRange(range) {
        if (range) {
          const [min, max] = range.split('-').map(Number);
          this.minPrice = min;
          this.maxPrice = max;
        }
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
  .speed-dial-content {
    padding: 16px;
  }
  
  .filter-card {
    box-shadow: 0 3px 5px -1px rgba(0,0,0,0.2), 
                0 5px 8px 0 rgba(0,0,0,0.14), 
                0 1px 14px 0 rgba(0,0,0,0.12);
  }
  </style>